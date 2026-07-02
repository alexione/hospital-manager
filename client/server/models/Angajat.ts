import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Angajat = sequelize.define('Angajat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_angajat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    nume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prenume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Registratură'
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: 'Angajati' });

export default Angajat;
