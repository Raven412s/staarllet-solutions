import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDb();

    const body = await req.json();
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = body.data;

    // Check if user exists
    const existing = await User.findOne({ clerkId });
    if (existing) return NextResponse.json({ ok: true });

    // First user should be Admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "Admin" : "Public";

    await User.create({
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses[0].email_address,
      clerkId,
      role,
      image: image_url,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
