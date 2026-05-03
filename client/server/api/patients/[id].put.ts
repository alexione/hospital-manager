import { Patient } from '../../models';

import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');
        const patient: any = await Patient.findByPk(id);
        
        if (!patient) {
            throw createError({ statusCode: 404, statusMessage: 'Pacient nu a fost găsit' });
        }

        const parts = await readMultipartFormData(event);
        if (!parts) {
            throw createError({ statusCode: 400, statusMessage: "No data received" });
        }

        const body: any = {};
        
        for (const part of parts) {
            if (part.name === 'image' && part.filename) {
                // Generăm un nume unic pentru fișier
                const fileName = `${Date.now()}_${part.filename}`;
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                fs.writeFileSync(path.join(uploadDir, fileName), part.data);
                body.image = fileName;

                // Opțional: șterge vechea imagine dacă există, pentru a economisi spațiu
                if (patient.image) {
                    const oldPath = path.join(uploadDir, patient.image);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                }

            } else if (part.name) {
                body[part.name] = part.data.toString('utf8');
            }
        }
        
        await patient.update(body);
        return patient;
    } catch (err: any) {
        console.error(err);
        throw createError({ statusCode: 500, statusMessage: err.message });
    }
});
