import {
  getUser,
  createGroup,
  createMember,
  disbandGroup,
  getGroup,
  updateBalance,
  fetchBalance,
} from "./repository/database";
import { getMemberGroups } from "./repository/database";
import {
  sendInvitedToGroupEmail,
  sendDisbandToGroupEmail,
} from "./service/emails";
import { Group, Friend } from "./models/models";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bree = require("./backgroundWorker");

const app = express();
const PORT = process.env.PORT || 4000;
bree.start();
app.use(bodyParser.json());

// TODO seperate this into multiple files and put in api folder

// Enable all CORS requests
app.use(cors());

// TODO(young): Add the APIs to be able to create, update, and delete friends.
let friends: Friend[] = [
  new Friend("winston", "https://bit.ly/sage-adebayo", "sdkf@gmail.com"),
  new Friend("nina", "https://bit.ly/dan-abramov", "sjadknksa@hotmail.com"),
  new Friend("tommy", "https://bit.ly/code-beast", "yahoo.ca"),
  new Friend("young", "https://bit.ly/sage-adebayo", "sadsal@business.ca"),
];

app.get("/", (req, res) => {
  res.send({ message: "Knock on wood" });
});

// API routes related to friends

app.get("/api/friends", (req, res) => {
  res.json(friends);
});

app.put("/api/friends/:currentName", (req, res) => {
  const { currentName } = req.params;
  const { newName } = req.body;

  const friend = friends.find((f) => f.name === currentName);

  if (!friend) {
    return res.status(404).json({ message: "Friend not found" });
  }

  friend.name = newName;

  res.json(friend);
});

app.post("/api/friends", (req, res) => {
  const { name, image, email } = req.body;
  const newFriend = new Friend(name, image, email);
  friends.push(newFriend);
  res.status(201).json(newFriend);
});

app.delete("/api/friends/:name", (req, res) => {
  const { name } = req.params;
  const index = friends.findIndex((f) => f.name === name);

  if (index === -1) {
    return res.status(404).json({ message: "Friend not found" });
  }

  const deletedFriend = friends.splice(index, 1);
  res.json({ message: "Friend deleted", friend: deletedFriend[0] });
});

//created a api route to get the user from supabase
app.get("/api/user", async (req, res) => {
  try {
    // Get the access token from the request headers
    const accessToken = req.headers.access_token;

    // Call the getUser function from the database to get user data
    const user = await getUser(accessToken);

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// To take an amount and update the balance in supabase
app.put("/api/settle_up", async (req, res) => {
  try {
    const { payment, groupId, email } = req.body;
    const balance = await fetchBalance(email, groupId);
    if (balance === null) {
      console.error("Could not fetch balance");
      return false;
    }
    const newBalance = balance - payment;
    if (newBalance < 0) {
      return res.status(400).json({ message: "You are making a overpayment" });
    }
    const success = await updateBalance(email, groupId, newBalance);
    if (!success) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json({ message: "Balance updated successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// API For Groups

app.get("/api/groups", async (req, res) => {
  const { groupName, active } = req.query;

  // Get all groups from the database
  const accessToken = req.headers.access_token;
  const user = await getUser(accessToken);

  // Retrieve groups based on the 'active' query parameter
  const groups = await getMemberGroups(user.email, active === "true");

  if (!groups) {
    return res.status(404).json({ message: "Error fetching groups" });
  }

  if (groupName) {
    const filteredGroup = groups.find(
      (group) =>
        group.subscription.name.toLowerCase() === groupName.toLowerCase()
    );

    if (filteredGroup) {
      // Include friends in the response
      res.json({ group: filteredGroup });
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } else {
    res.json(groups);
  }
});

app.get("/api/groups/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const accessToken = req.headers.access_token;

  const user = await getUser(accessToken);
  const group = await getGroup(user.email, groupId);

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  } else {
    return res.json(group);
  }
});

// Create a new group
app.post("/api/groups", async (req, res) => {
  const { subscription, friends, id } = req.body; //getting subscription and friends from the front end

  const newGroup = new Group(subscription, friends, id); // id is undefined

  const accessToken = req.headers.access_token;

  // Calculate the next_billing_date based on the provided billing_date
  const billingDate = new Date(subscription.billing_date);
  const nextBillingDate = new Date(
    billingDate.getTime() + 30 * 24 * 60 * 60 * 1000
  );

  const user = await getUser(accessToken);

  const createdGroup = await createGroup(
    user.id,
    subscription.name,
    subscription.cost,
    new Date(),
    subscription.image,
    subscription.billing_date,
    nextBillingDate // Use the calculated next_billing_date
  );

  for (const memberData of friends) {
    const createdFriend = await createMember(
      createdGroup.id, // the return data (id) when you create a group table in supabase
      memberData.email,
      memberData.isowner,
      memberData.active,
      new Date(),
      memberData.balance,
      memberData.subscription_cost
    );
  }

  try {
    const sendEmailPromises = friends
      .filter((friend) => friend.email !== user.email)
      .map((recipient) =>
        sendInvitedToGroupEmail(user.email, recipient.email, subscription.name)
      );

    await Promise.all(sendEmailPromises);

    res.status(201).send("Invitation emails sent successfully.");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(501).send("Error sending emails.");
  }
});

//disband a group
app.put("/api/groups/:id", async (req, res) => {
  try {
    const groupId = req.params.id;
    const accessToken = req.headers.access_token;
    const user = await getUser(accessToken);
    const group = await getGroup(user.email, groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const success = await disbandGroup(groupId);
    if (!success) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Attempt to send emails only if disband was successful
    try {
      const sendEmailPromises = group.friends.map((recipient) =>
        sendDisbandToGroupEmail(
          user.email,
          recipient.email as string,
          group.subscription.name
        )
      );
      await Promise.all(sendEmailPromises);
      // Consolidate success message here, after ensuring emails are sent
      return res
        .status(201)
        .json({ message: "Group disbanded and emails sent successfully." });
    } catch (error) {
      console.error("Error sending emails:", error);
      // Include email error in response but don't attempt to resend a status
      return res.status(500).json({
        message: "Group disbanded, but an error occurred sending emails.",
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app;
