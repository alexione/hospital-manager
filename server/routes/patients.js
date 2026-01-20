const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Middleware global pentru acest router: Toate rutele de aici cer Login
router.use(verifyToken);

// 1. GET ALL (Lista pacienți)
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
        // Numărăm toți pacienții
        const total = await Patient.count();

        // Numărăm doar cei internați
        const internati = await Patient.count({ where: { status: 'internat' } });

        // Numărăm urgențele
        const urgente = await Patient.count({ where: { status: 'urgență' } });

        // Luăm ultimii 5 pacienți adăugați pentru tabelul mic
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

// 2. CREATE (Adaugă pacient CU POZĂ)
// Adăugăm upload.single('image')
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Datele text sunt în req.body
        const patientData = req.body;

        // Dacă s-a încărcat un fișier, adăugăm numele lui
        if (req.file) {
            patientData.image = req.file.filename;
        }

        const newPatient = await Patient.create(patientData);
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: "Eroare la creare: " + err.message });
    }
});

// 3. UPDATE (Modifică pacient CU POZĂ)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) return res.status(404).json({ message: "Pacientul nu există" });

        const updatedData = req.body;

        // Dacă trimitem o poză nouă, o actualizăm. Dacă nu, păstrăm cea veche.
        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await patient.update(updatedData);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. DELETE (Șterge pacient)
// Doar ADMINII pot șterge (folosim req.userRole setat de verifyToken)
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