import { sequelize } from '../models';

export default defineNitroPlugin(async (nitroApp) => {
    try {
        await sequelize.authenticate();
        console.log('✅ Baza de date conectată cu succes (Nitro).');
        
        // Sincronizare modele (alter: true va actualiza schemele existente fără a șterge datele)
        await sequelize.sync({ alter: true });
        console.log('✅ Modelele au fost sincronizate cu baza de date.');
    } catch (error) {
        console.error('❌ Eroare la conectarea la baza de date:', error);
    }
});
