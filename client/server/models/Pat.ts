import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Pat = sequelize.define('Pat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_pat: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    id_salon: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'Paturi' });

export default Pat;
