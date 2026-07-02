import { Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const angajati = await Angajat.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        return angajati;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
