import { redirect } from "next/navigation";
import { connection } from "next/server";
import { IncomeList } from "@/features/finance/view/income_list";
import { IncomeRepository } from "@/features/finance/repository/income_repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export const instant = false;
export default async function Page() {
  await connection();
  const supabase=await createSupabaseServerClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/entrar");
  const {data}=await new IncomeRepository(supabase).listForUser(user.id);
  return <><div className="panel-welcome"><div><span className="panel-eyebrow">CONTROLE DO SEU TRABALHO</span><h1>Entradas</h1><p>Registre serviços e acompanhe os recebimentos da sua rotina.</p></div></div><IncomeList records={data||[]}/></>;
}
