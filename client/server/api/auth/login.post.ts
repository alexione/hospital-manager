import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Angajat } from '../../models';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    // @ts-ignore
    const user = await Angajat.findOne({ where: { email } });
    if (!user) {
        throw createError({ statusCode: 404, statusMessage: "Utilizatorul nu a fost găsit." });
    }

    // @ts-ignore
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw createError({ statusCode: 401, statusMessage: "Parola este incorectă." });
    }

    const secret = process.env.JWT_SECRET || 'cheia_mea_secreta_super_lunga';
    const token = jwt.sign(
        // @ts-ignore
        { id: user.id, role: user.role, email: user.email, nume: user.nume, prenume: user.prenume },
        secret,
        { expiresIn: '24h' }
    );

    return {
        token: token,
        user: {
            // @ts-ignore
            id: user.id,
            // @ts-ignore
            email: user.email,
            // @ts-ignore
            nume: user.nume,
            // @ts-ignore
            prenume: user.prenume,
            // @ts-ignore
            role: user.role,
            // @ts-ignore
            avatar: user.avatar
        }
    };
});
