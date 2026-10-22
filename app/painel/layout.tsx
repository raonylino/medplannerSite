import { redirect } from "next/navigation";
import { AppNavigation, SignOutButton } from "@/features/app_shell/view/app_navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const instant = false;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const name = String(user.user_metadata?.full_name || user.email?.split("@")[0] || "Minha conta");
  const hasPlus = user.app_metadata?.plan === "plus";
  return <div className="panel-shell"><AppNavigation name={name} email={user.email || ""} hasPlus={hasPlus}/><div className="panel-main"><header className="panel-topbar"><span className="online-status"><i/> Dados da sua conta</span><span className="mobile-signout"><SignOutButton/></span></header><main className="panel-content">{children}</main></div></div>;
}
