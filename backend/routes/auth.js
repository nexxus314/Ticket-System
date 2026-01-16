const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const users = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { email, password, adminSecret } = req.body || {};

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "The user already exists" });
    }

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = adminSecret === process.env.ADMIN_SECRET ? "admin" : "user";

    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        role,
    };

    users.push(newUser);
    return res.json({ message: "user created successfully", role: newUser.role });
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "User or email not found" });
    }

    const isUser = await bcrypt.compare(password, user.password);
    if (!isUser) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return res.json({ token, role: user.role });
});

module.exports = router;