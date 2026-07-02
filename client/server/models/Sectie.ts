import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Sectie = sequelize.define('Sectie', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_sectie: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nume: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'Sectii' });

export default Sectie;
