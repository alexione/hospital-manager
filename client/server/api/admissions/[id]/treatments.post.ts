import { Tratament } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (!user || (user.role.toLowerCase() !== 'medic' && user.role.toLowerCase() !== 'admin')) {
            throw createError({ statusCode: 403, statusMessage: "Doar medicii sau administratorii pot prescrie tratamente." });
        }

        const id_internare = getRouterParam(event, 'id');
        const body = await readBody(event);
        
        if (!body.descriere) {
            throw createError({ statusCode: 400, statusMessage: "Descrierea tratamentului este obligatorie." });
        }

        const newTreatment = await Tratament.create({
            id_internare: parseInt(id_internare),
            descriere: body.descriere,
            data_tratament: new Date()
        });

        return newTreatment;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.statusMessage || err.message });
    }
});
