import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, password } = body;

		console.log("New User Registered:", { name, email });

		return NextResponse.json({
			success: true,
			message: "User registered successfully!",
		}, { status: 201 });
	} catch (error) {
		return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
	}
}
