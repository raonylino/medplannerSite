import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { CalendarDays, CreditCard, LockKeyhole, Target } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const featureData = {
  planejamento: { title: "Planejamento", label: "PLANEJE SEUS PRÓXIMOS MESES", description: "Organize despesas previstas e mantenha seus compromissos em vista.", icon: CalendarDays },
  cartoes: { title: "Cartões", label: "ACOMPANHE SUAS COMPRAS", description: "Veja parcelas e faturas organizadas por cartão e por mês.", icon: CreditCard },
  metas: { title: "Metas", label: "CONSTRUA SEUS OBJETIVOS", description: "Transforme objetivos em metas que você consegue acompanhar.", icon: Target },
} as const;
export const metadata: Metadata = { title: "Recursos Plus | MedPlanner", robots: { index: false, follow: false } };
export const instant = false;
export default async function Page({ params }: { params: Promise<{feature:string}> }) {
  const {feature}=await params; if(!(feature in featureData))notFound();
  const data=featureData[feature as keyof typeof featureData]; const supabase=await createSupabaseServerClient(); const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/entrar");
  if(user.app_metadata?.plan!=="plus") return <section className="panel-card paywall-card"><span className="paywall-icon"><LockKeyhole size={22}/></span><span className="panel-eyebrow">RECURSO DO MEDPLANNER PLUS</span><h1>{data.title}, quando você precisar.</h1><p>{data.description} Esse recurso ficará disponível no plano pago, que está em preparação.</p><div className="coming-soon"><span className="coming-dot"/> Assinatura em preparação</div><Link className="button button-outline" style={{marginTop:16}} href="/#planos">Conhecer os planos</Link></section>;
  const Icon=data.icon;
  return <section className="panel-card paywall-card"><span className="paywall-icon"><Icon size={22}/></span><span className="panel-eyebrow">{data.label}</span><h1>{data.title}</h1><p>Seu plano Plus está ativo. A área está sendo preparada.</p></section>;
}
