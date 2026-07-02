import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Administrare = sequelize.define('Administrare', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_tratament: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nume_asistent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_administrare: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    observatii: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { tableName: 'Administrari' });

export default Administrare;
