import { Masuratori } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (!user || (user.role.toLowerCase() !== 'asistent' && user.role.toLowerCase() !== 'medic' && user.role.toLowerCase() !== 'admin')) {
            throw createError({ statusCode: 403, statusMessage: "Doar asistenții, medicii sau administratorii pot adăuga măsurători." });
        }

        const id_internare = getRouterParam(event, 'id');
        const body = await readBody(event);
        const { temperatura, tensiune, puls, greutate } = body;

        const newVitals = await Masuratori.create({
            id_internare: parseInt(id_internare),
            temperatura: temperatura ? parseFloat(temperatura) : null,
            tensiune: tensiune || null,
            puls: puls ? parseInt(puls) : null,
            greutate: greutate ? parseFloat(greutate) : null,
            nume_asistent: `${user.nume} ${user.prenume}`,
            data_masurare: new Date()
        });

        return newVitals;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.statusMessage || err.message });
    }
});
