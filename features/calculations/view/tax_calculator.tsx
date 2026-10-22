"use client";

import { useState } from "react";
import { CircleDollarSign, Percent } from "lucide-react";

function money(value:number){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number.isFinite(value)?value:0)}
export function TaxCalculator(){
  const [amount,setAmount]=useState("10000");const [tax,setTax]=useState("6");const [reserve,setReserve]=useState("10");
  const income=Number(amount.replace(",","."))||0;const taxPct=Number(tax.replace(",","."))||0;const reservePct=Number(reserve.replace(",","."))||0;
  const taxValue=income*taxPct/100;const reserveValue=income*reservePct/100;const after=income-taxValue-reserveValue;
  return <><div className="panel-welcome"><div><span className="panel-eyebrow">SIMULAÇÃO FINANCEIRA</span><h1>Calculadora de <span>reservas</span></h1><p>Tenha uma estimativa antes de distribuir o que recebeu.</p></div></div><section className="panel-card"><div className="panel-section-title"><div><span className="panel-eyebrow">AJUSTE OS VALORES</span><h2>Quanto você recebeu?</h2></div><span className="new-entry-icon"><CircleDollarSign size={17}/></span></div><div className="calculator-card"><div className="calculator-inputs"><label>Valor recebido (R$)<input type="number" inputMode="decimal" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label><label>Estimativa para impostos (%)<input type="number" inputMode="decimal" min="0" max="100" step="0.1" value={tax} onChange={e=>setTax(e.target.value)}/></label><label>Reserva para investimentos (%)<input type="number" inputMode="decimal" min="0" max="100" step="0.1" value={reserve} onChange={e=>setReserve(e.target.value)}/></label></div><div className="calculator-result"><span>Valor estimado disponível</span><strong>{money(after)}</strong><small>Impostos: {money(taxValue)}<br/>Reserva: {money(reserveValue)}</small><hr/><small>Percentuais aplicados: {taxPct + reservePct}%</small></div></div><p className="calculator-note"><Percent size={13} style={{verticalAlign:"middle",marginRight:5}}/>Esta ferramenta é uma simulação para organização pessoal, não substitui orientação contábil. Confirme as alíquotas e obrigações aplicáveis à sua empresa com um profissional.</p></section></>;
}
