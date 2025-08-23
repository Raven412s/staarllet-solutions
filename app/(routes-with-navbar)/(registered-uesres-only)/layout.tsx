// app/(registered-users-only)/account/layout.tsx
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function RegisteredUsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
   const user = await getUser()

   if (!user) redirect('/login')

    if(user?.role !== 'Admin' && 'Public')

    // pages like account, my-courses, etc. will be hidden for non registered users
    return <>{children}</>;
}
