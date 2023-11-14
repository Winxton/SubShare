import * as dotenv from "dotenv";
dotenv.config();

import { getUser, createGroup, getGroups } from "./database";
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
let groups: Group[] = [];

// TODO(young): Add the APIs to be able to create, update, and delete friends.
let friends: Friend[] = [
  new Friend("winston", "https://bit.ly/sage-adebayo"),
  new Friend("nina", "https://bit.ly/dan-abramov"),
  new Friend("tommy", "https://bit.ly/code-beast"),
  new Friend("young", "https://bit.ly/sage-adebayo"),
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
  const { name, image } = req.body;
  const newFriend = new Friend(name, image);
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

// API routes related to groups

//get selected groups
app.get("/api/groups", async (req, res) => {
  const { groupName } = req.query;
  // Get all groups from the database
  const accessToken = req.headers.access_token;
  const user = await getUser(accessToken);
  const groups = await getGroups(user.id);

  if (!groups) {
    return res.status(404).json({ message: "Error fetching groups" });
  }

  if (groupName) {
    const filteredGroup = groups.find(
      (group) =>
        group.subscription.name.toLowerCase() === groupName.toLowerCase()
    );

    if (filteredGroup) {
      res.json([filteredGroup]);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } else {
    res.json(groups);
  }
});

// Create a new group
app.post("/api/groups", async (req, res) => {
  const { subscription, friends } = req.body;

  const newGroup = new Group(subscription, friends);

  const accessToken = req.headers.access_token;
  const user = await getUser(accessToken);

  const created = createGroup(
    user.id,
    subscription.name,
    subscription.cost,
    new Date(),
    subscription.image
  );

  res.status(201).json(newGroup);
});

// Delete a group
app.delete("/api/groups/:name", (req, res) => {
  const groupName = req.params.name;
  const index = groups.findIndex(
    (group) => group.subscription.name === groupName
  );
  if (index !== -1) {
    const deletedGroup = groups.splice(index, 1);
    res.json(deletedGroup);
  } else {
    res.status(404).send("Group not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
