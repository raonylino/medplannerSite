import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedPlanner | Mais clareza para cuidar do seu dinheiro",
  description:
    "Organize entradas, despesas e metas em um só lugar. O MedPlanner ajuda profissionais PJ a cuidar melhor da vida financeira.",
  applicationName: "MedPlanner",
  icons: { icon: "/images/medplanner-icon.png" },
  openGraph: {
    title: "MedPlanner | Mais clareza para cuidar do seu dinheiro",
    description: "Organize suas entradas, planeje despesas e tenha mais tranquilidade para cuidar da sua vida financeira.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
