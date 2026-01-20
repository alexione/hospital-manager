const jwt = require('jsonwebtoken');

// 1. Verifică dacă ești logat
exports.verifyToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    
    // Tokenul vine de obicei sub forma: "Bearer h38f38f38..."
    if (!tokenHeader) {
        return res.status(403).json({ message: "No token provided!" });
    }

    const token = tokenHeader.split(" ")[1]; // Luăm doar codul, fără cuvântul Bearer

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
        
        // Salvăm datele userului în request ca să le folosim mai târziu
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next(); // Treci mai departe
    });
};

// 2. Verifică dacă ești ADMIN
exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: "Require Admin Role!" });
    }
    next();
};