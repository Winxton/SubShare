import {
  getUser,
  createGroup,
  createMember,
  getGroups,
  getMembers,
  deleteGroup,
  acceptInvitedGroup,
} from "./database";
import { getMemberGroups } from "./database";

import { Group, Friend } from "./models";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

// Enable all CORS requests
app.use(cors());

// This will serve as our in-memory database for now
let temporaryGroups: Group[] = [];

// TODO(young): Add the APIs to be able to create, update, and delete friends.
let friends: Friend[] = [
  new Friend("winston", "https://bit.ly/sage-adebayo", "sdkf@gmail.com"),
  new Friend("nina", "https://bit.ly/dan-abramov", "sjadknksa@hotmail.com"),
  new Friend("tommy", "https://bit.ly/code-beast", "yahoo.ca"),
  new Friend("young", "https://bit.ly/sage-adebayo", "sadsal@business.ca"),
];

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

//get selected groups
app.get("/api/groups", async (req, res) => {
  const { groupName, accepted } = req.query;

  // Get all groups from the database
  const accessToken = req.headers.access_token;
  const user = await getUser(accessToken);

  let groups;
  if (accepted) {
    groups = await getMemberGroups(user.email);
  } else {
    groups = await getGroups(user.id);
  }

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

// Create a new group
app.post("/api/groups", async (req, res) => {
  // TODO(tommy): create friends in the database as well.
  const { subscription, friends, id } = req.body; //getting subscription and friends from the front end

  const newGroup = new Group(subscription, friends, id); // id is undefined

  const accessToken = req.headers.access_token;
  const user = await getUser(accessToken);

  const createdGroup = await createGroup(
    user.id,
    subscription.name,
    subscription.cost,
    new Date(),
    subscription.image
  );

  for (const memberData of friends) {
    const createdFriend = await createMember(
      createdGroup.id, // the return data (id) when you create a group table in supabase
      memberData.email,
      memberData.isOwner,
      memberData.accepted,
      new Date(),
      memberData.balance
    );
  }
  res.status(201).json(newGroup);
});

// Delete a group
app.delete("/api/groups/:id", async (req, res) => {
  try {
    // Get the name of the group to delete from the request parameters
    const groupID = req.params.id;

    // Call the deleteGroup function from the database to delete the group
    const success = await deleteGroup(groupID);

    if (success) {
      res.json({ message: "Group deleted successfully" });
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.put("/api/groups/:id", async (req, res) => {
  
  try {
    // Get the ID of the group to update from the request parameters
    const groupID = req.params.id;
    
    const accessToken = req.headers.access_token;
    
    const user = await getUser(accessToken);

    // Update the group status in the database
    const success = await acceptInvitedGroup(user.email,groupID);
    
    if (success) {
      res.json({ message: "Group updated successfully" });
    } else {
      res.status(404).json({ message: "Group not found or update failed" });
    }
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
