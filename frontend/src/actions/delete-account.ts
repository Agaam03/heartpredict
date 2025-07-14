"use server"

import { auth } from '@/auth'; // Sesuaikan dengan auth yang kamu pakai (NextAuth, lucia, dll)
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';

export async function deleteUserAccountWithBackup() {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const user = await getUserByEmail(session.user.email)

  if (!user) throw new Error('User not found');

  // Buat backup data
  // const userBackup = {
  //   id: user.id,
  //   email: user.email,
  //   name: user.name,
  //   role: user.role,
  //   createdAt: new Date().toISOString(),
  //   accounts: user.accounts,
  //   twoFactorConfirmation: user.twoFactorConfirmation,
  //   predictionResults: user.PredictionResult.map((pr) => ({
  //     ...pr,
  //     aiChats: pr.aiChats,
  //   })),
  //   aiChats: user.aiChats,
  // };

  // const backupJson = JSON.stringify(userBackup, null, 2);

  // // Kirim ke email
  // await transporter.sendMail({
  //   from: '"Heart Predict" <no-reply@heartpredict.ai>',
  //   to: user.email,
  //   subject: 'Backup Data Heart Predict Anda',
  //   text: 'Berikut backup data Anda sebelum akun dihapus.',
  //   attachments: [
  //     {
  //       filename: 'heart-predict-backup.json',
  //       content: backupJson,
  //     },
  //   ],
  // });

  // Hapus semua data
  await db.$transaction(async (tx) => {
    await tx.aIChat.deleteMany({ where: { userId: user.id } });
    await tx.predictionResult.deleteMany({ where: { userId: user.id } });
    await tx.account.deleteMany({ where: { userId: user.id } });
    await tx.twoFactorConfirmation.deleteMany({ where: { userId: user.id } });
    await tx.user.delete({ where: { id: user.id } });
  });

  return { success: true };
}

export const getUserDataStats = async (userId: string) => {
    const session = await auth();

    // Verify authorization
    if (!session?.user?.id || session.user.id !== userId) {
        return { success: false, error: "Unauthorized access" };
    }

    try {
        // Get counts of all related data
        const [
            predictionCount,
            aiChatCount,
            accountCount,
            user
        ] = await Promise.all([
            db.predictionResult.count({
                where: { userId }
            }),
            db.aIChat.count({
                where: {
                    PredictionResult: {
                        userId
                    }
                }
            }),
            db.account.count({
                where: { userId }
            }),
            db.user.findUnique({
                where: { id: userId },
                select: {
                    name: true,
                    email: true,
                    isTwoFactorEnabled: true
                }
            })
        ]);

        return {
            success: true,
            data: {
                user: user,
                predictions: predictionCount,
                aiChats: aiChatCount,
                connectedAccounts: accountCount,
                totalDataPoints: predictionCount + aiChatCount + accountCount + 1 // +1 for user account
            }
        };
    } catch (error) {
        console.error("Error getting user data stats:", error);
        return { 
            success: false, 
            error: "Gagal mengambil statistik data user" 
        };
    }
};