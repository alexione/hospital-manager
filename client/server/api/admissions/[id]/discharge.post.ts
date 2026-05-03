import { Internare, Patient } from '../../../models';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const internare: any = await Internare.findByPk(id);
        
        if (!internare) {
            throw createError({ statusCode: 404, statusMessage: "Internarea nu exista" });
        }

        internare.status = 'externat';
        internare.data_externare = new Date();
        internare.id_pat = null; // Elibereaza patul
        
        await internare.save();

        // Actualizeaza si statusul in tabelul Pacient
        const patient: any = await Patient.findByPk(internare.id_pacient);
        if (patient) {
            patient.status = 'externat';
            patient.salon = null; // Stergem salonul de la pacient cand e externat
            await patient.save();
        }

        return internare;
    } catch (err: any) {
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
