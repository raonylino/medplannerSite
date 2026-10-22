"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IncomeRepository } from "../repository/income_repository";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function useIncomeViewModel() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function addIncome(input: { service: string; quantity: number; amount: number; date: string }) {
    setBusy(true); setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Sua sessão expirou. Entre novamente.");
      const date = new Date(`${input.date}T12:00:00`);
      const month = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
      const { error } = await new IncomeRepository(supabase).createForUser(user.id, {
        service: input.service.trim(), quantity: input.quantity,
        unit_cents: Math.round(input.amount * 100), date: date.toISOString(), receive_month: month,
      });
      if (error) throw error;
      router.refresh();
      return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar a entrada."); return false; }
    finally { setBusy(false); }
  }
  return { busy, error, setError, addIncome };
}
