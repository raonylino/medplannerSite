import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
export const metadata: Metadata = { title: "Senha alterada | MedPlanner", robots: { index: false, follow: false } };
export default function Page() { return <main className="message-page"><Link className="auth-brand" href="/"><span className="brand-mark"><span>✳</span></span><span>Med<span>Planner</span></span></Link><section className="message-card"><span className="message-icon success-icon"><Check size={27}/></span><span className="auth-card-kicker"><span/> ACESSO ATUALIZADO</span><h1>Senha alterada.</h1><p>Sua senha foi atualizada com sucesso. Você já pode continuar usando sua conta com segurança.</p><Link className="button button-lime message-button" href="/painel">Acessar o MedPlanner <Check size={16}/></Link></section></main>; }
