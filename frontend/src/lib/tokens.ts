import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';

export const generatePasswordResetToken = async (email : string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); 
    // 1 hour from now
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { id: existingToken.id }
        });
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data:  {
            email,
            token,
            expires,
        }
    });
    return passwordResetToken;
}
export const generateVerificationToken = async (email : string) => {
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000); 
    // 1 hour from now
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        });
    }

    const newToken = await db.verificationToken.create({
        data:  {
            email,
            token,
            expires,
        }
    });
    return newToken;
}