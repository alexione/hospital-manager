import { Internare, Patient, Pat, Salon, Sectie } from '../../models';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        
        // Generam un cod de internare unic pentru identificare
        if (!body.cod_internare) {
            body.cod_internare = 'INT' + Math.floor(10000 + Math.random() * 90000);
        }

        // Salvam internarea in baza de date
        const newAd = await Internare.create(body);

        // Modificam starea pacientului pentru a aparea ca "internat"
        const patient: any = await Patient.findByPk(body.id_pacient);
        if (patient) {
            patient.status = 'internat';
            patient.diagnosis = body.diagnostic; // Preluam diagnosticul din internare
            
            // Daca are pat asignat, putem gasi salonul si sa il trecem la pacient
            if (body.id_pat) {
                const patInfo = await Pat.findByPk(body.id_pat, { include: [Salon] });
                // @ts-ignore
                if (patInfo && patInfo.Salon) {
                    // @ts-ignore
                    patient.salon = patInfo.Salon.cod_salon;
                }
            }

            await patient.save();
        }

        return newAd;
    } catch (err: any) {
        throw createError({ statusCode: 400, statusMessage: "Eroare la internare: " + err.message });
    }
});
