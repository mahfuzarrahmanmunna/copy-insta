// app/api/login/route.js
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 1. Check if fields are present
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password required" },
        { status: 400 },
      );
    }

    const pool = await dbConnect();

    // 2. INSERT or UPDATE Logic
    // If user is new: Create them with role 'user'.
    // If user exists: Update ONLY the password. Do NOT touch the role column.
    const query = `
      INSERT INTO users (username, password, role) 
      VALUES (?, ?, 'user')
      ON DUPLICATE KEY UPDATE 
        password = VALUES(password)
    `;

    await pool.query(query, [username, password]);
    console.log("✅ Connected to MariaDB (Production)");

    // 3. THE CHECKER: Fetch the user's current data from the database
    // This ensures we get the REAL role (even if you manually changed it to 'admin' in SQL)
    const users = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return NextResponse.json(
        { message: "Error retrieving user" },
        { status: 500 },
      );
    }

    const user = users[0];

    // 4. Return the actual role from the database to the frontend
    return NextResponse.json({
      message: "Login successful!",
      role: user.role,
      username: user.username,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
