const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

class Subscription {
    constructor(public name: string, public image: string, public cost: number) {}
}

class Group {
    constructor(public subscription: Subscription, public friends: Friend[]) {}
}

class Friend {
    constructor (public name: string, public image: string) {}
}

// This will serve as our in-memory database for now
let groups: Group[] = []; 

// TODO(young): Add the APIs to be able to create, update, and delete friends.
let friends: Friend[] = []; 

app.get('/api/friends', (req, res) => {
    res.json(friends);
});

app.put('/api/friends/:currentName', (req, res) => {
    const { currentName } = req.params;
    const { newName } = req.body;
  
    const friend = friends.find((f) => f.name === currentName);
  
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
  
    friend.name = newName;
  
    res.json(friend);
});

app.post('/api/friends', (req, res) => {
    const { name, image } = req.body;
    const newFriend = new Friend(name, image);
    friends.push(newFriend);
    res.status(201).json(newFriend);
  });

app.delete('/api/friends/:name', (req, res) => {
    const { name } = req.params;
    const index = friends.findIndex((f) => f.name === name);

    if (index === -1) {
        return res.status(404).json({ message: 'Friend not found' });
    }

    const deletedFriend = friends.splice(index, 1);
    res.json({ message: 'Friend deleted', friend: deletedFriend[0] });
});

// List all groups
app.get('/api/groups', (req, res) => {
    res.json(groups);
});

// Create a new group
app.post('/api/groups', (req, res) => {
    const { subscription, friends } = req.body;

    const newGroup = new Group(subscription, friends);
    groups.push(newGroup);
    res.status(201).json(newGroup);
});

// Delete a group
app.delete('/api/groups/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < groups.length) {
        const deletedGroup = groups.splice(index, 1);
        res.json(deletedGroup);
    } else {
        res.status(404).send('Group not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
