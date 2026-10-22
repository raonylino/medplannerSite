import type { SupabaseClient } from "@supabase/supabase-js";

export type IncomeRecord = {
  id: number;
  service: string;
  quantity: number;
  unit_cents: number;
  date: string;
  receive_month: string;
  received: number;
  tax_applies: number;
};

export type FinanceSnapshot = {
  incomes?: IncomeRecord[];
  expenses?: Array<Record<string, unknown>>;
  card_expenses?: Array<Record<string, unknown>>;
  cards?: Array<Record<string, unknown>>;
  investments?: Array<Record<string, unknown>>;
  settings?: Array<Record<string, unknown>>;
};

export class IncomeRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getSnapshotForUser(userId: string) {
    const { data, error } = await this.supabase.from("finance_backups").select("data").eq("user_id", userId).maybeSingle();
    if (error) return { data: null as FinanceSnapshot | null, error };
    const snapshot = data?.data as FinanceSnapshot | null;
    return { data: snapshot ?? {}, error: null };
  }

  async listForUser(userId: string) {
    const { data: snapshot, error } = await this.getSnapshotForUser(userId);
    if (error) return { data: [] as IncomeRecord[], error };
    const records = Array.isArray(snapshot?.incomes) ? snapshot.incomes : [];
    return { data: [...records].sort((a, b) => b.date.localeCompare(a.date)), error: null };
  }

  async createForUser(userId: string, input: { service: string; quantity: number; unit_cents: number; date: string; receive_month: string }) {
    const { data, error } = await this.supabase.from("finance_backups").select("data").eq("user_id", userId).maybeSingle();
    if (error) return { error };
    const snapshot = data?.data && typeof data.data === "object" ? data.data as Record<string, unknown> : {};
    const incomes = Array.isArray(snapshot.incomes) ? snapshot.incomes as IncomeRecord[] : [];
    const id = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
    const nextSnapshot = {
      ...snapshot,
      incomes: [...incomes, { id, ...input, tax_applies: 0, received: 0, investment_ids: "*" }],
    };
    const result = await this.supabase.from("finance_backups").upsert({
      user_id: userId,
      data: nextSnapshot,
      schema_version: 1,
      updated_at: new Date().toISOString(),
    });
    return { error: result.error };
  }
}
