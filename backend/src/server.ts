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
