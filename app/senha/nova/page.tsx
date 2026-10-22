import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/view/auth_form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export const metadata: Metadata = { title: "Nova senha | MedPlanner", robots: { index: false, follow: false } };
export const instant = false;
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/senha/recuperar?link=expirado");
  return <AuthForm mode="new-password"/>;
}
