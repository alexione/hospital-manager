const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/users', require('./routes/users'));
app.get('/', (req, res) => {
    res.send('Hospital API is running...');
});

const startServer = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database connected & Tables synced!');
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed. Retrying in 5 seconds...');
        console.error(error.message);
        setTimeout(startServer, 5000);
    }
};

startServer();