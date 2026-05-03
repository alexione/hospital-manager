import sequelize from '../utils/db';
import Angajat from './Angajat';
import Sectie from './Sectie';
import Salon from './Salon';
import Pat from './Pat';
import Patient from './Patient';
import Internare from './Internare';
import Tratament from './Tratament';

// Definiere relații
Sectie.hasMany(Salon, { foreignKey: 'id_sectie', onDelete: 'CASCADE' });
Salon.belongsTo(Sectie, { foreignKey: 'id_sectie' });

Salon.hasMany(Pat, { foreignKey: 'id_salon', onDelete: 'CASCADE' });
Pat.belongsTo(Salon, { foreignKey: 'id_salon' });

Patient.hasMany(Internare, { foreignKey: 'id_pacient', onDelete: 'CASCADE' });
Internare.belongsTo(Patient, { foreignKey: 'id_pacient' });

Pat.hasMany(Internare, { foreignKey: 'id_pat', onDelete: 'SET NULL' });
Internare.belongsTo(Pat, { foreignKey: 'id_pat' });

Internare.hasMany(Tratament, { foreignKey: 'id_internare', onDelete: 'CASCADE' });
Tratament.belongsTo(Internare, { foreignKey: 'id_internare' });

export {
    sequelize,
    Angajat,
    Sectie,
    Salon,
    Pat,
    Patient,
    Internare,
    Tratament
};
