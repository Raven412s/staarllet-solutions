// app/(registered-users-only)/account/layout.tsx
import { redirect } from "next/navigation";
import { connectToDb } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server"; // Clerk ka server-side helper

export default async function RegisteredUsersLayout({
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

    if (!user || (user.role !== "Admin" && user.role !== "Public")) {
        redirect("/"); // sirf jab user registered nahi hai ya role invalid hai
    }


    // pages like account, my-courses, etc. will be hidden for non registered users
    return <>{children}</>;
}
