import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "business") redirect("/login");
  return (
    <DashboardLayout role="business" companyName={session.company_name}>
      {children}
    </DashboardLayout>
  );
}
