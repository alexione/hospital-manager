import { Pat } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Acces interzis! Doar administratorii pot modifica structura.' });
        }

        const body = await readBody(event);
        const { cod_pat, id_salon } = body;
        const newPat = await Pat.create({ cod_pat, id_salon });
        return newPat;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 400, statusMessage: err.statusMessage || err.message });
    }
});
