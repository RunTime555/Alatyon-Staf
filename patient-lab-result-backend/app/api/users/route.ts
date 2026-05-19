import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await query('SELECT id, email, role, created_at FROM users');
    return NextResponse.json({ 
      success: true, 
      users: result.rows 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}