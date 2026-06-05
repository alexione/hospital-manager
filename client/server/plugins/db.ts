import { sequelize } from '../models';

export default defineNitroPlugin(async (nitroApp) => {
    try {
        await sequelize.authenticate();
        console.log('Baza de date conectată cu succes (Nitro).');
        
        // Sincronizare modele (creează tabelele dacă nu există, fără a încerca să le modifice la fiecare pornire)
        await sequelize.sync();
        console.log('Modelele au fost sincronizate cu baza de date.');
    } catch (error) {
        console.error('Eroare la conectarea la baza de date:', error);
    }
});
