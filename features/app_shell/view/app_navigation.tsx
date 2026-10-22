"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowDownLeft, Calculator, CalendarDays, ChartNoAxesCombined, CreditCard, House, LogOut, Target } from "lucide-react";
import { useAuthViewModel } from "@/features/auth/viewmodel/use_auth_view_model";

const items = [
  { href: "/painel", label: "Início", icon: House },
  { href: "/painel/entradas", label: "Entradas", icon: ArrowDownLeft },
  { href: "/painel/calculos", label: "Cálculos", icon: Calculator },
  { href: "/painel/plus/planejamento", label: "Planejar", icon: CalendarDays, paid: true },
  { href: "/painel/plus/cartoes", label: "Cartões", icon: CreditCard, paid: true },
  { href: "/painel/plus/metas", label: "Metas", icon: Target, paid: true },
];

export function AppNavigation({ name, email, hasPlus }: { name: string; email: string; hasPlus: boolean }) {
  const pathname = usePathname();
  const firstName = name.trim().split(/\s+/)[0] || "Sua conta";
  return <aside className="panel-sidebar"><Link href="/" className="panel-brand"><span className="brand-mark"><ChartNoAxesCombined size={18}/></span><span>Med<span>Planner</span></span></Link><span className="panel-sidebar-label">SEU ESPAÇO</span><nav className="panel-nav">{items.map(({href,label,icon:Icon,paid})=><Link key={href} href={href} className={`${pathname===href?"active":""} ${paid?"paid-nav":""}`}><span className="nav-icon"><Icon size={16}/></span>{label}</Link>)}</nav><div className="panel-sidebar-spacer"/><div className="sidebar-upgrade"><span>{hasPlus?"MEDPLANNER PLUS":"MAIS POSSIBILIDADES"}</span><p>{hasPlus?"Seu plano Plus está ativo.":"Tenha ferramentas para planejar e acompanhar seus objetivos."}</p><Link href="/#planos">Conhecer os planos →</Link></div><div className="sidebar-user"><span className="user-avatar">{firstName.charAt(0).toUpperCase()}</span><div><b>{firstName}</b><small>{email}</small></div><SignOutButton/></div></aside>;
}

export function SignOutButton() {
  const vm = useAuthViewModel();
  return <button className="signout-button" onClick={() => void vm.signOut()} aria-label="Sair"><LogOut size={15}/></button>;
}
