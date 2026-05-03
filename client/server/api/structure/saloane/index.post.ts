import { Salon } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { cod_salon, id_sectie } = body;
        const newSalon = await Salon.create({ cod_salon, id_sectie });
        return newSalon;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: err.message });
    }
});
