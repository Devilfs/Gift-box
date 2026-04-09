import { NextRequest, NextResponse } from 'next/server';
import { createGift, validatePassword } from '@/lib/actions';
import { CreateGiftInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const input: CreateGiftInput = await request.json();
    const result = await createGift(input);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      id: result.giftId,
      message: 'Gift created successfully',
    });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, password } = body;

    if (!giftId || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await validatePassword(giftId, password);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({ valid: result.valid });
  } catch (error) {
    console.error('Error validating password:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


