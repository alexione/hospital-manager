const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// PROTECȚIE TOTALĂ: Doar Adminii au voie aici
router.use(verifyToken);
router.use(isAdmin);

// 1. GET ALL (Lista tuturor utilizatorilor)
router.get('/', async (req, res) => {
    try {
        // Returnăm userii, dar FĂRĂ parolă (security best practice)
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. CREATE (Adminul creează un alt user)
router.post('/', upload.single('avatar'), async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Verificăm duplicat
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email deja existent." });

        // Hash parola
        const hashedPassword = await bcrypt.hash(password, 10);
        const avatarPath = req.file ? req.file.filename : null;

        const newUser = await User.create({
            email,
            password: hashedPassword,
            role: role || 'user',
            avatar: avatarPath
        });

        // Nu trimitem parola înapoi
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. DELETE (Adminul șterge un user)
router.delete('/:id', async (req, res) => {
    try {
        const idToDelete = parseInt(req.params.id);
        
        // Siguranță: Nu te poți șterge pe tine însuți
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