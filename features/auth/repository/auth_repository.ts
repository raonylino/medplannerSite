import type { SupabaseClient } from "@supabase/supabase-js";

export class AuthRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(input: { name: string; email: string; password: string; avatarId: number }) {
    return this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/email/confirmado`,
        data: { full_name: input.name.trim(), avatar_index: input.avatarId },
      },
    });
  }

  async sendPasswordReset(email: string) {
    return this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/senha/nova`,
    });
  }

  async updatePassword(password: string) {
    return this.supabase.auth.updateUser({ password });
  }
}
