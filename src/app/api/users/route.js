// app/api/users/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = await dbConnect();

    // Fetch all users, ordered by newest first
    const users = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC",
    );

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 },
    );
  }
}
