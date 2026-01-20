const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);
router.use(isAdmin);

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('avatar'), async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email deja existent." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarPath = req.file ? req.file.filename : null;

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
            avatar: avatarPath
        });

        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id);
        
        if (idToDelete === req.userId) {
            return res.status(400).json({ message: "Nu îți poți șterge propriul cont!" });
        }

        const user = await User.findByPk(idToDelete);
        if (!user) return res.status(404).json({ message: "Userul nu există" });

        await user.destroy();
        res.json({ message: "User șters cu succes" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;