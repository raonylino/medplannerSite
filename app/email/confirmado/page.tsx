import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";

export const metadata: Metadata = { title: "E-mail confirmado | MedPlanner", robots: { index: false, follow: false } };

export default function Page() {
  return <main className="message-page">
    <Link className="auth-brand" href="/"><span className="brand-mark"><span>✳</span></span><span>Med<span>Planner</span></span></Link>
    <section className="message-card">
      <span className="message-icon success-icon"><Check size={27}/></span>
      <span className="auth-card-kicker"><span/> CONFIRMAÇÃO CONCLUÍDA</span>
      <h1>E-mail confirmado com sucesso.</h1>
      <p>Seu endereço foi verificado e sua conta está pronta. Entre no MedPlanner para continuar.</p>
      <Link className="button button-lime message-button" href="/entrar">Ir para o login <Check size={16}/></Link>
    </section>
    <small className="auth-foot"><ShieldCheck size={13}/> Seus dados financeiros permanecem protegidos.</small>
  </main>;
}
