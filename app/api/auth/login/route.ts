import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server'; // Added NextRequest
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) { // Added Type to fix red underline
    try {
        const { identifier, password } = await request.json();

        // 1. Search for user (By Email or MRN)
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier.toLowerCase() },
                    { mrn: identifier }
                ]
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found!" }, 
                { status: 404 }
            );
        }

        // 2. Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid password!" }, 
                { status: 401 }
            );
        }

        // 3. Generate Token
        const token = signToken({ id: user.id, email: user.email, role: user.role });

        const response = NextResponse.json({ 
            success: true, 
            role: user.role,
            name: user.name 
        });

        // 4. Set Cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 24 hours
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("LOGIN_ERROR:", error);
        return NextResponse.json(
            { error: "Login failed. Please try again." }, 
            { status: 500 }
        );
    }
}