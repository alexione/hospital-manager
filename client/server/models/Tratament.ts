import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Tratament = sequelize.define('Tratament', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_internare: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descriere: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    data_tratament: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, { tableName: 'Tratamente' });

export default Tratament;
