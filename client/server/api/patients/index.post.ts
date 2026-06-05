import { Patient } from '../../models';

import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    try {
        // Extragem datele trimise din formular (inclusiv poza)
        const parts = await readMultipartFormData(event);
        if (!parts) {
            throw createError({ statusCode: 400, statusMessage: "Nu s-au primit date." });
        }

        const body: any = {};
        
        // Parcurgem fiecare bucata din formular pentru a extrage textul si fisierele
        for (const part of parts) {
            if (part.name === 'image' && part.filename) {
                // Generăm un nume unic pentru fișier
                const fileName = `${Date.now()}_${part.filename}`;
                // Salvăm în directorul public pentru a putea fi accesat de frontend
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                fs.writeFileSync(path.join(uploadDir, fileName), part.data);
                body.image = fileName;
            } else if (part.name) {
                body[part.name] = part.data.toString('utf8');
            }
        }
        
        if (!body.cod_pacient) {
            body.cod_pacient = Math.floor(100000 + Math.random() * 900000);
        }

        // Forțăm starea 'admis' la crearea pacientului în sistem
        body.status = 'admis';

        const newPatient = await Patient.create(body);
        return newPatient;
    } catch (err: any) {
        console.error(err);
        let msg = err.message;
        if (err.errors && err.errors.length > 0) {
            msg = err.errors.map((e: any) => {
                if (e.path === 'cnp' && e.type === 'unique violation') {
                    return 'Un pacient cu acest CNP este deja înregistrat.';
                }
                if (e.path === 'cod_pacient' && e.type === 'unique violation') {
                    return 'Codul de pacient este deja utilizat.';
                }
                return e.message;
            }).join(', ');
        }
        throw createError({ statusCode: 400, statusMessage: "Eroare la creare: " + msg });
    }
});
