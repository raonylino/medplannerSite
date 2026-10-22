import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/view/auth_form";
export const metadata: Metadata = { title: "Criar conta | MedPlanner", robots: { index: false, follow: false } };
export default function Page() { return <AuthForm mode="register"/>; }
