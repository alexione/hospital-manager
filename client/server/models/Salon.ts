import { DataTypes } from 'sequelize';
import sequelize from '../utils/db';

const Salon = sequelize.define('Salon', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cod_salon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_sectie: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Salon;
