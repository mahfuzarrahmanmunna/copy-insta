import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

// GET: Fetch all links
export async function GET() {
  let pool;
  try {
    pool = await dbConnect();
    const rows = await pool.query(
      "SELECT * FROM site_settings ORDER BY id DESC",
    );
    return NextResponse.json({ links: rows });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST: Handle BOTH Adding new links AND Setting active link
export async function POST(request) {
  let pool;
  try {
    const body = await request.json();
    pool = await dbConnect();

    // --- LOGIC A: ADD A NEW LINK ---
    if (body.url) {
      // Insert the new link as inactive (0) by default
      await pool.query(
        "INSERT INTO site_settings (redirect_url, is_active) VALUES (?, 0)",
        [body.url],
      );
      return NextResponse.json({
        success: true,
        message: "Link added successfully",
      });
    }

    // --- LOGIC B: SET ACTIVE LINK ---
    if (body.id) {
      // 1. Set ALL links to inactive
      await pool.query("UPDATE site_settings SET is_active = 0");
      // 2. Set the selected link to active
      await pool.query("UPDATE site_settings SET is_active = 1 WHERE id = ?", [
        body.id,
      ]);
      return NextResponse.json({
        success: true,
        message: "Active link updated",
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 },
    );
  }
}
