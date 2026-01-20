const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asigurăm existența folderului uploads
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Nume unic: data-curentă + extensia originală
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filtrare fișiere (doar imagini)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

module.exports = multer({ storage, fileFilter });