"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuthViewModel } from "../viewmodel/use_auth_view_model";

type AuthMode = "login" | "register" | "recover" | "new-password";
const avatarOptions = Array.from({ length: 28 }, (_, index) => index + 1);
const passwordScore = (value: string) => [
  value.length >= 8,
  value.length >= 12,
  /[a-z]/.test(value),
  /[A-Z]/.test(value),
  /\d/.test(value),
  /[^A-Za-z0-9]/.test(value),
].filter(Boolean).length;
const acceptablePassword = (value: string) => value.length >= 8 && passwordScore(value) >= 3;

export function AuthForm({ mode, initialNotice = "" }: { mode: AuthMode; initialNotice?: string }) {
  const vm = useAuthViewModel(initialNotice);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarId, setAvatarId] = useState(1);
  const [password, setPassword] = useState("");
  const title = { login: "Que bom ter você de volta", register: "Crie sua conta", recover: "Vamos recuperar seu acesso", "new-password": "Escolha sua nova senha" }[mode];
  const subtitle = { login: "Entre para continuar cuidando do seu dinheiro.", register: "Dê o primeiro passo para ter mais clareza financeira.", recover: "Enviaremos um link seguro para o seu e-mail.", "new-password": "Use uma senha forte que você ainda não utiliza." }[mode];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const email = String(fields.get("email") || "").trim();
    if (mode === "login") return vm.signIn(email, String(fields.get("password") || ""));
    if (mode === "register") {
      const name = String(fields.get("name") || "").trim();
      const first = String(fields.get("password") || "");
      if (first !== String(fields.get("confirmPassword") || "")) return vm.setError("As senhas não coincidem.");
      if (!acceptablePassword(first)) return vm.setError("Use pelo menos 8 caracteres e combine tipos diferentes de caracteres.");
      return vm.signUp({ name, email, password: first, avatarId });
    }
    if (mode === "recover") return vm.requestPasswordReset(email);
    const first = String(fields.get("password") || "");
    if (!acceptablePassword(first)) return vm.setError("Use pelo menos 8 caracteres e combine tipos diferentes de caracteres.");
    if (first !== String(fields.get("confirmPassword") || "")) return vm.setError("As senhas não coincidem.");
    return vm.updatePassword(first);
  }

  return <div className="auth-shell"><Link href="/" className="auth-brand"><span className="brand-mark"><span>✳</span></span><span>Med<span>Planner</span></span></Link><Link href={mode === "login" ? "/" : "/entrar"} className="auth-back"><ArrowLeft size={15}/> Voltar</Link><div className="auth-card"><div className="auth-card-kicker"><span/> {mode === "register" ? "COMECE GRATUITAMENTE" : "SUA VIDA FINANCEIRA, COM MAIS CLAREZA"}</div><h1>{title}</h1><p>{subtitle}</p><form onSubmit={submit}>
    {mode === "register" && <><label className="field-label" htmlFor="name">Seu nome</label><div className="auth-input"><UserRound size={17}/><input id="name" name="name" autoComplete="name" placeholder="Como podemos te chamar?" required minLength={2}/></div><label className="field-label avatar-label">Escolha um avatar</label><div className="avatar-choices">{avatarOptions.map((id)=><button key={id} type="button" aria-label={`Selecionar avatar ${id}`} aria-pressed={avatarId===id} className={avatarId===id?"selected":""} onClick={()=>setAvatarId(id)}><Image src={`/images/avatars/avatar_${String(id).padStart(2,"0")}.png`} alt="" width={37} height={37} unoptimized/></button>)}</div></>}
    {mode !== "new-password" && <><label className="field-label" htmlFor="email">E-mail</label><div className="auth-input"><Mail size={17}/><input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required/></div></>}
    {mode !== "recover" && <><label className="field-label" htmlFor="password">{mode === "new-password" ? "Nova senha" : "Senha"}</label><div className="auth-input"><LockKeyhole size={17}/><input id="password" name="password" type={showPassword?"text":"password"} autoComplete={mode==="login"?"current-password":"new-password"} placeholder={mode==="login"?"Sua senha":"Pelo menos 8 caracteres"} minLength={mode === "login" ? undefined : 8} required value={password} onChange={(event)=>setPassword(event.target.value)}/><button type="button" className="password-toggle" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Ocultar senha":"Mostrar senha"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>{(mode === "register" || mode === "new-password") && password.length > 0 && <PasswordStrengthIndicator password={password}/>}</>}
    {(mode === "register" || mode === "new-password") && <><label className="field-label" htmlFor="confirmPassword">Confirmar senha</label><div className="auth-input"><LockKeyhole size={17}/><input id="confirmPassword" name="confirmPassword" type={showPassword?"text":"password"} autoComplete="new-password" placeholder="Digite a senha novamente" minLength={8} required/></div></>}
    {mode === "login" && <div className="recover-inline"><Link href="/senha/recuperar">Esqueci minha senha</Link></div>}
    {vm.error && <div className="form-message error-message" role="alert">{vm.error}</div>}{vm.notice && <div className="form-message notice-message" role="status">{vm.notice}</div>}
    <button className="button button-lime auth-submit" disabled={vm.busy}>{vm.busy?"Aguarde…":({login:"Entrar",register:"Criar minha conta",recover:"Enviar link de recuperação","new-password":"Salvar nova senha"}[mode])}<ArrowRight size={16}/></button>
  </form>
  {mode === "login" && <div className="auth-switch">Ainda não tem uma conta? <Link href="/criar-conta">Criar conta</Link></div>}{mode === "register" && <div className="auth-switch">Já tem uma conta? <Link href="/entrar">Entrar</Link></div>}{mode === "recover" && <div className="auth-switch"><Link href="/entrar">Voltar para o login</Link></div>}{mode === "new-password" && <div className="auth-switch">O link é pessoal e pode ser usado uma única vez.</div>}
  </div><div className="auth-foot"><LockKeyhole size={13}/> Seus dados financeiros permanecem protegidos.</div></div>;
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const score = passwordScore(password);
  const level = score <= 2 ? 1 : score <= 4 ? 2 : 3;
  const label = level === 1 ? "Fraca" : level === 2 ? "Média" : "Forte";
  return <div className={`password-strength strength-${level}`} aria-live="polite">
    <div className="password-strength-top"><div className="password-strength-bars">{[1, 2, 3].map((bar) => <span key={bar} className={bar <= level ? "active" : ""}/>)}</div><b>Senha {label.toLowerCase()}</b></div>
    <small>Mínimo de 8 caracteres. Combine maiúsculas, minúsculas, números ou símbolos.</small>
  </div>;
}
