const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Budget = require('./models/pb_schema'); // Adjust the path to pb_schema as necessary

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Serve static files from the "public" directory
app.use("/", express.static("public"));

// MongoDB connection
const url = 'mongodb://127.0.0.1:27017/myDB'; // Update MongoDB URL if necessary
mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((connectionError) => {
        console.error("Error while connecting to the db", connectionError);
    });


// Sample endpoint
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to get budget items
app.get('/budget', async (req, res) => {
    try {
        const data = await Budget.find({});
        res.json(data);
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Error querying the database' });
    }
});

// Endpoint to add a budget item
app.post('/addBudgetItem', async (req, res) => {
    const { title, budget, color } = req.body;

    const newBudgetItem = new Budget({
        title,
        budget,
        color,
    });

    try {
        const savedItem = await newBudgetItem.save();
        res.status(201).json({ success: true, data: savedItem });
    } catch (err) {
        console.error('Error saving budget item:', err);
        res.status(500).json({ error: 'Error saving budget item' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
