import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default async function TransporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "transporter") redirect("/login");
  return (
    <DashboardLayout role="transporter" companyName={session.company_name}>
      {children}
    </DashboardLayout>
  );
}
