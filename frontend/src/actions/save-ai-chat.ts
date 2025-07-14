'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function getAndSaveAiChat(predictionResultId: string, userMessage: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized");

  // Panggil backend Python untuk dapatkan AI response
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_DEV}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ predictionResultId, userMessage }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.detail || 'Failed to get AI response');

  // Simpan ke database lewat Prisma
  const savedChat = await db.aIChat.create({
    data: {
      userId,
      predictionResultId,
      userMessage,
      aiResponse: data.response,
      timestamp: new Date(),  
    },
  });

  return savedChat;
}
