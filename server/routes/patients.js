const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.findAll({ order: [['createdAt', 'DESC']] });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/dashboard-stats', async (req, res) => {
    try {
        const total = await Patient.count();

        const internati = await Patient.count({ where: { status: 'internat' } });

        const urgente = await Patient.count({ where: { status: 'urgență' } });

        const recenti = await Patient.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            total,
            internati,
            urgente,
            recenti
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const patientData = req.body;
        if (req.file) {
            patientData.image = req.file.filename;
        }

        const newPatient = await Patient.create(patientData);
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: "Eroare la creare: " + err.message });
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: "Pacientul nu există" });

        const updatedData = req.body;
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await patient.update(updatedData);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: "Doar adminii pot șterge pacienți!" });
        }

        const patient = await Patient.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: "Pacientul nu există" });

        await patient.destroy();
        res.json({ message: "Pacient șters cu succes" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;