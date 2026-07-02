import bcrypt from 'bcryptjs';
import { Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, role, nume, prenume } = body;

    if (!email || !password || !nume || !prenume) {
        throw createError({ statusCode: 400, statusMessage: "Lipsesc câmpuri obligatorii." });
    }

    const existingUser = await Angajat.findOne({ where: { email } });
    if (existingUser) {
        throw createError({ statusCode: 400, statusMessage: "Email deja folosit." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generează cod angajat
    const cod_angajat = Math.floor(100000 + Math.random() * 900000);

    await Angajat.create({
        nume,
        prenume,
        cod_angajat,
        email,
        password: hashedPassword,
        role: role || 'Registratură'
    });

    return { message: "Utilizator înregistrat cu succes!" };
});
