import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Masuratori = sequelize.define('Masuratori', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_internare: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    temperatura: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    tensiune: {
        type: DataTypes.STRING,
        allowNull: true
    },
    puls: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    greutate: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    nume_asistent: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_masurare: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

export default Masuratori;
