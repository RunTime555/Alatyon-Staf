import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;
    
    console.log("📝 Register attempt for:", email);
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await query(
      `SELECT email FROM users WHERE email = $1`,
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }
    
    // Get next patient ID number
    const countResult = await query(`SELECT COUNT(*) FROM patients`);
    const count = parseInt(countResult.rows[0].count);
    const nextNumber = count + 1;
    const customId = `P${String(nextNumber).padStart(4, '0')}`;
    
    console.log("📋 Generated ID:", customId);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    await query(
      `INSERT INTO users (internal_id, custom_id, email, password_hash, role) 
       VALUES (uuid_generate_v4(), $1, $2, $3, 'patient')`,
      [customId, email, hashedPassword]
    );
    
    // Insert patient
    await query(
      `INSERT INTO patients (id, name, phone) 
       VALUES ($1, $2, $3)`,
      [customId, name, phone || null]
    );
    
    console.log("✅ User registered successfully:", customId);
    
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: customId,
          email: email,
          name: name,
          role: 'patient'
        }
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('💥 Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}