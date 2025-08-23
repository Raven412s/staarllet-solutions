// app/api/current-user/route.ts

import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  await connectToDb();
  const user = await User.findOne({ clerkId: session.userId });

  return NextResponse.json({ user });
}
