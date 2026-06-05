import { Administrare, Tratament } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user;
        if (!user || (user.role.toLowerCase() !== 'asistent' && user.role.toLowerCase() !== 'medic' && user.role.toLowerCase() !== 'admin')) {
            throw createError({ statusCode: 403, statusMessage: "Doar asistenții, medicii sau administratorii pot administra tratamente." });
        }

        const body = await readBody(event);
        const { id_tratament, observatii } = body;

        if (!id_tratament) {
            throw createError({ statusCode: 400, statusMessage: "ID-ul tratamentului este obligatoriu." });
        }

        // Verify treatment exists
        const treatment = await Tratament.findByPk(id_tratament);
        if (!treatment) {
            throw createError({ statusCode: 404, statusMessage: "Tratamentul nu există." });
        }

        const newAdminLog = await Administrare.create({
            id_tratament,
            nume_asistent: `${user.nume} ${user.prenume}`,
            observatii: observatii || '',
            data_administrare: new Date()
        });

        return newAdminLog;
    } catch (err: any) {
        throw createError({ statusCode: err.statusCode || 500, statusMessage: err.statusMessage || err.message });
    }
});
