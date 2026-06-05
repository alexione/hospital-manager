import { Salon } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Acces interzis! Doar administratorii pot modifica structura.' });
        }

        const body = await readBody(event);
        const { cod_salon, id_sectie } = body;
        const newSalon = await Salon.create({ cod_salon, id_sectie });
        return newSalon;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 400, statusMessage: err.statusMessage || err.message });
    }
});
