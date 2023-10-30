const express = require('express');

const app = express();
const PORT = 4000;

// Sample route
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
