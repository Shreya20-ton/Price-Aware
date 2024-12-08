const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/user', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const User = mongoose.model('User ', userSchema); // Changed 'data' to 'User ' for clarity

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/post', async (req, res) => {
    const { name, password } = req.body; // Destructure name and password from req.body

    const user = new User({ // Corrected to use User model
        name,
        password
    });

    try {
        await user.save();
        console.log(user);
        res.send("Form Submission Successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving user");
    }
});

app.listen(port, () => {
    console.log("Server Started on port " + port);
});