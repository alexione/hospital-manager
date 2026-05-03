import { Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        // Validare ca doar un admin poate șterge
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Acces interzis! Doar administratorii pot șterge angajați.' });
        }

        const id = getRouterParam(event, 'id');
        
        // Nu permite administratorului sa se stearga pe sine
        if (user.id == id) {
            throw createError({ statusCode: 400, statusMessage: 'Nu te poți șterge pe tine însuți!' });
        }

        const angajat = await Angajat.findByPk(id);
        if (!angajat) {
            throw createError({ statusCode: 404, statusMessage: 'Angajat nu a fost găsit' });
        }

        await angajat.destroy();
        return { message: 'Angajat șters cu succes' };
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.statusMessage || err.message });
    }
});
