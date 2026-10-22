"use client";

import { useSearchParams } from "next/navigation";
import { AuthForm } from "./auth_form";

type AuthMode = "login" | "recover";

export function AuthRouteForm({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const initialNotice = mode === "login"
    ? searchParams.get("erro") === "link"
      ? "Este link não é mais válido. Solicite uma nova recuperação de senha."
      : ""
    : searchParams.get("link") === "expirado"
      ? "Esse link venceu ou já foi usado. Informe seu e-mail para receber um novo."
      : "";

  return <AuthForm mode={mode} initialNotice={initialNotice}/>;
}
