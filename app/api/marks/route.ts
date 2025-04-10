import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("student-result-management");
  const marks = await db.collection("marks").find({}).toArray();
  return NextResponse.json(marks);
}

export async function POST(req: Request) {
  const client = await clientPromise;
  const db = client.db("student-result-management");
  const body = await req.json();

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array of mark entries." }, { status: 400 });
  }

  const result = await db.collection("marks").insertMany(body);
  return NextResponse.json({ message: "Marks submitted", insertedCount: result.insertedCount });
}
