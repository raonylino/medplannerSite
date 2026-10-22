"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { useIncomeViewModel } from "../viewmodel/use_income_view_model";

function localDateToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function IncomeForm() {
  const vm = useIncomeViewModel();
  const [created, setCreated] = useState(false);
  const [date, setDate] = useState("");
  useEffect(() => setDate(localDateToday()), []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setCreated(false); const form = event.currentTarget;
    const data = new FormData(event.currentTarget);
    const success = await vm.addIncome({ service:String(data.get("service")||""), quantity:Number(data.get("quantity")), amount:Number(String(data.get("amount")).replace(",",".")), date:String(data.get("date")) });
    if (success) { form.reset(); setCreated(true); }
  }
  return <section className="panel-card income-create-card"><div className="panel-section-title"><div><span className="panel-eyebrow">NOVO REGISTRO</span><h2>Adicionar uma entrada</h2></div><span className="new-entry-icon"><Plus size={18}/></span></div><form className="income-form" onSubmit={submit}><label>Serviço ou descrição<input name="service" placeholder="Ex.: Consulta particular" minLength={2} required/></label><label>Quantidade<input name="quantity" type="number" inputMode="decimal" min="0.001" step="0.001" defaultValue="1" required/></label><label>Valor por serviço <span>(R$)</span><input name="amount" type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0,00" required/></label><label>Data do atendimento<input name="date" type="date" value={date} onChange={(event)=>setDate(event.target.value)} required/></label><div className="income-form-footer">{vm.error&&<span className="inline-form-error" role="alert">{vm.error}</span>}{created&&<span className="inline-form-success" role="status">Entrada salva.</span>}<button className="button button-lime" disabled={vm.busy || !date}>{vm.busy?"Salvando…":"Adicionar entrada"}<ArrowRight size={15}/></button></div></form></section>;
}
