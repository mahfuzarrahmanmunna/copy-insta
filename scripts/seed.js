// scripts/seed.js
import { MongoClient, ServerApiVersion } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://instagramlogin:0DCvAgByIRkaYg4l@cluster0.vw5okhq.mongodb.net/?appName=Cluster0";
const DB_NAME = "instagramDB";

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function seedUsers() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection("users");

    // Sample users with plain text passwords
    const users = [
      {
        username: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@example.com",
      },
      {
        username: "user1",
        password: "password123",
        role: "user",
        email: "user1@example.com",
      },
      {
        username: "testuser",
        password: "test123",
        role: "user",
        email: "test@example.com",
      },
    ];

    // Clear existing users
    await collection.deleteMany({});

    // Insert new users
    const result = await collection.insertMany(users);

    console.log(`✅ Seeded ${result.insertedCount} users successfully!`);
    console.log("\n📋 Sample Login Credentials:");
    console.log(
      "Username: admin, Password: admin123 (Admin - can see all passwords)",
    );
    console.log("Username: user1, Password: password123");
    console.log("Username: testuser, Password: test123");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    await client.close();
  }
}

seedUsers();
