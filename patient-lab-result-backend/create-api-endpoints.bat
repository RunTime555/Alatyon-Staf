@echo off
echo Creating API endpoints...

REM Create health endpoint
mkdir app\api\health 2>nul
echo import { NextRequest, NextResponse } from 'next/server'; > app\api\health\route.ts
echo. >> app\api\health\route.ts
echo export async function GET(request: NextRequest) { >> app\api\health\route.ts
echo   return NextResponse.json({ status: 'ok', message: 'Server is running!' }); >> app\api\health\route.ts
echo } >> app\api\health\route.ts

REM Create login endpoint
mkdir app\api\auth\login 2>nul
echo import { NextRequest, NextResponse } from 'next/server'; > app\api\auth\login\route.ts
echo. >> app\api\auth\login\route.ts
echo export async function POST(request: NextRequest) { >> app\api\auth\login\route.ts
echo   const body = await request.json(); >> app\api\auth\login\route.ts
echo   return NextResponse.json({ success: true, data: body }); >> app\api\auth\login\route.ts
echo } >> app\api\auth\login\route.ts

echo API endpoints created successfully!
pause