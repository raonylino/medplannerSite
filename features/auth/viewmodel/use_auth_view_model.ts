"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthRepository } from "../repository/auth_repository";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useAuthViewModel(initialNotice = "") {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(initialNotice);

  async function run(task: () => Promise<{ error: { message: string } | null }>, success: () => void) {
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await task();
      if (result.error) throw result.error;
      success();
    } catch (cause) {
      const rawMessage = cause instanceof Error ? cause.message : "";
      const message = rawMessage.includes("Invalid login credentials")
        ? "E-mail ou senha incorretos. Confira os dados e tente de novo."
        : rawMessage.includes("Email not confirmed")
          ? "Confirme seu e-mail antes de entrar. Confira a caixa de entrada e o spam."
          : rawMessage.includes("User already registered")
            ? "Já existe uma conta com este e-mail. Tente entrar."
            : rawMessage || "Não foi possível concluir. Tente novamente.";
      setError(message);
    } finally { setBusy(false); }
  }

  const repository = () => new AuthRepository(createSupabaseBrowserClient());
  return {
    busy, error, notice, setError, setNotice,
    async signIn(email: string, password: string) {
      await run(() => repository().signIn(email, password), () => router.replace("/painel"));
    },
    async signUp(input: { name: string; email: string; password: string; avatarId: number }) {
      setBusy(true); setError(""); setNotice("");
      try {
        const { data, error } = await repository().signUp(input);
        if (error) throw error;
        if (data.session) router.replace("/painel");
        else router.replace(`/cadastro/sucesso?email=${encodeURIComponent(input.email)}`);
      } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível criar sua conta."); }
      finally { setBusy(false); }
    },
    async requestPasswordReset(email: string) {
      await run(() => repository().sendPasswordReset(email), () => setNotice("Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha."));
    },
    async updatePassword(password: string) {
      await run(() => repository().updatePassword(password), () => router.replace("/senha/alterada"));
    },
    async signOut() {
      await createSupabaseBrowserClient().auth.signOut();
      router.replace("/"); router.refresh();
    },
  };
}
