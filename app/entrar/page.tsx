import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/features/auth/view/auth_form";
import { AuthRouteForm } from "@/features/auth/view/auth_route_form";
export const metadata: Metadata = { title: "Entrar | MedPlanner", robots: { index: false, follow: false } };
export default function Page() {
  return <Suspense fallback={<AuthForm mode="login"/>}><AuthRouteForm mode="login"/></Suspense>;
}
