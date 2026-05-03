import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || 'hospital_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'rootpassword',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3307,
        dialect: 'mysql',
        logging: false, // Oprește logurile lungi SQL în consolă
    }
);

export default sequelize;
