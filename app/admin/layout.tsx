// app/admin/layout.tsx
import { getUser } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUser()

  if (!user) redirect('/login');
  if (user.role !== "Admin") redirect('/')


  return (
    <>
      {children}
    </>
  );
}
