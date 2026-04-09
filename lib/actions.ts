'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from './db';
import { CreateGiftInput, GiftWithItems } from '@/types';
import { hash, compare } from 'bcryptjs';
import { Gift, GiftItem } from '@prisma/client';

export async function createGift(input: CreateGiftInput): Promise<{ success: boolean; giftId?: string; error?: string }> {
  try {
    // Hash password if provided
    let passwordHash = null;
    if (input.password) {
      passwordHash = await hash(input.password, 10);
    }

    // Create gift
    const gift = await prisma.gift.create({
      data: {
        title: input.title,
        senderName: input.sender_name,
        receiverName: input.receiver_name,
        message: input.message || null,
        theme: input.theme,
        passwordHash: passwordHash,
        unlockDate: input.unlock_date || null,
      },
    });

    // Create gift items
    if (input.items.length > 0) {
      const itemsToInsert = input.items.map((item, index) => ({
        giftId: gift.id,
        type: item.type,
        contentText: item.content_text || null,
        mediaUrl: item.media_url || null,
        caption: item.caption || null,
        position: item.position ?? index,
      }));

      try {
        await prisma.giftItem.createMany({
          data: itemsToInsert,
        });
      } catch (itemsError) {
        // Rollback gift creation if items fail
        await prisma.gift.delete({
          where: { id: gift.id },
        });
        return { success: false, error: 'Failed to create gift items' };
      }
    }

    revalidatePath('/');
    return { success: true, giftId: gift.id };
  } catch (error) {
    console.error('Error creating gift:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getGift(giftId: string): Promise<{ success: boolean; gift?: GiftWithItems; error?: string }> {
  try {
    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      include: {
        items: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!gift) {
      return { success: false, error: 'Gift not found' };
    }

    return { success: true, gift: gift as GiftWithItems };
  } catch (error) {
    console.error('Error fetching gift:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function validatePassword(
  giftId: string,
  password: string
): Promise<{ success: boolean; valid?: boolean; error?: string }> {
  try {
    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      select: { passwordHash: true },
    });

    if (!gift) {
      return { success: false, error: 'Gift not found' };
    }

    if (!gift.passwordHash) {
      return { success: true, valid: true };
    }

    const valid = await compare(password, gift.passwordHash);
    return { success: true, valid };
  } catch (error) {
    console.error('Error validating password:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function markGiftOpened(giftId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.gift.update({
      where: { id: giftId },
      data: { isOpened: true },
    });

    revalidatePath(`/gift/${giftId}`);
    return { success: true };
  } catch (error) {
    console.error('Error marking gift as opened:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function updateGift(
  giftId: string,
  updates: Partial<Pick<Gift, 'title' | 'message' | 'theme'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.gift.update({
      where: { id: giftId },
      data: updates,
    });

    revalidatePath(`/gift/${giftId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating gift:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function deleteGift(giftId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Items are deleted automatically due to CASCADE
    await prisma.gift.delete({
      where: { id: giftId },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting gift:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

