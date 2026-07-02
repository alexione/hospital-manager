import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Internare = sequelize.define('Internare', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_internare: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    id_pacient: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_pat: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    data_internare: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    data_externare: {
        type: DataTypes.DATE,
        allowNull: true
    },
    diagnostic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('internat', 'externat', 'urgență', 'decedat'),
        defaultValue: 'internat'
    }
}, { tableName: 'Internari' });

export default Internare;
