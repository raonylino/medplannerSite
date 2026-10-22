import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DashboardView } from "@/features/dashboard/view/dashboard_view";
import { IncomeRepository } from "@/features/finance/repository/income_repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export const instant = false;
export default async function Page() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const { data } = await new IncomeRepository(supabase).getSnapshotForUser(user.id);
  return <DashboardView name={String(user.user_metadata?.full_name || user.email?.split("@")[0] || "") } snapshot={data||{}}/>;
}
