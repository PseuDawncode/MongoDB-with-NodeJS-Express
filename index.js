import express from "express";
import mongoose from "mongoose";
 
const app = express();
app.use(express.json());

mongoose
.connect("mongodb://localhost:27017/myfirstdatabase")
.then (() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Could not connect to MongoDB", err));

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    age: Number
});

const User = mongoose.model("User", userSchema);

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);

    } catch (error) {
        res.status(500).json({
        error: "Failed to get users",
        });
    }
});

app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);

    } catch (error) {
        res.status(500).json({
        error: "Failed to post users",
        });
    }

});

app.put("/users/:id", async (req, res) => {
    try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    });

    if (!updatedUser) {
    return res.status(404).json({ error: "user not found"});
    }
    res.json(updatedUser);

    } catch (error) {
        res.status(500).json({
        error: "Failed to update user",
        });
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
    return res.status(404).json({ error: "User not found"});
    }
    res.json({ message: "User deleted", user: deletedUser});

    } catch (error) {
        res.status(500).json({
        error: "Failed to delete user",
        });
    }
    
});

app.listen(3000, () => console.log ("Server is running at http://localhost:3000")
);