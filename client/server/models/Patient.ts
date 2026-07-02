import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_pacient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cnp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'admis'
    },
    salon: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { tableName: 'Pacienti' });

export default Patient;
