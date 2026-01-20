const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarPath = req.file ? req.file.filename : null;

        await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
            avatar: avatarPath
        });

        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Eroare la register:", error);
        res.status(500).json({ message: "Server error." });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error("Eroare la login:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;