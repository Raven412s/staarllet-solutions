// app/admin/layout.tsx
import { redirect } from "next/navigation";
import {connectToDb} from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server"; // Clerk ka server-side helper

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // await zaroori hai
  const userId = session.userId; // ya jo bhi aapne config me set kiya hai

  if (!userId) {
    redirect("/login"); // agar login nahi hai
  }

  // agar admin check karna hai
   await connectToDb();
  const user = await User.findOne({ clerkId: userId });

  if (!user || user.role !== "Admin") {
    redirect("/"); // not admin → home page
  }


  return <>{children}</>;
}
