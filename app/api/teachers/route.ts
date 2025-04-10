import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("student-result-management");
  const teachers = await db.collection("teachers").find({}).toArray();
  return NextResponse.json(teachers);
}
