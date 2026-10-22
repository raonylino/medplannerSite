"use client";

import { useEffect, useState } from "react";
export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Olá");
  useEffect(() => { const hour = new Date().getHours(); setGreeting(hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"); }, []);
  const firstName = name.trim().split(/\s+/)[0] || "por aqui";
  return <>{greeting}, <span>{firstName}</span></>;
}
