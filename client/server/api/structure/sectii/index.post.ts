import { Sectie } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (user?.role?.toLowerCase() !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Acces interzis! Doar administratorii pot modifica structura.' });
        }

        const body = await readBody(event);
        const { nume, cod_sectie } = body;
        const newSectie = await Sectie.create({ nume, cod_sectie });
        return newSectie;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 400, statusMessage: err.statusMessage || err.message });
    }
});
