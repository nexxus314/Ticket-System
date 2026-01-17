const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { email, password, adminSecret } = req.body || {};

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "The user already exists" });
        }

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const role = adminSecret === process.env.ADMIN_SECRET ? "admin" : "user";

        const newUser = new User({
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();
        return res.json({ message: "user created successfully", role: newUser.role });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User or email not found" });
        }

        const isUser = await bcrypt.compare(password, user.password);
        if (!isUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.json({ token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;