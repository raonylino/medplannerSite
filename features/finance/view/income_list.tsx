import type { IncomeRecord } from "../repository/income_repository";
import { IncomeForm } from "./income_form";

function money(cents: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents/100); }
function dateLabel(date: string) { return new Intl.DateTimeFormat("pt-BR", { day:"2-digit", month:"short", year:"numeric" }).format(new Date(date)); }

export function IncomeList({ records }: { records: IncomeRecord[] }) {
  return <><IncomeForm/><section className="panel-card income-list-card"><div className="panel-section-title"><div><span className="panel-eyebrow">SEU HISTÓRICO</span><h2>Entradas cadastradas</h2></div><span className="record-count">{records.length} {records.length===1?"registro":"registros"}</span></div>{records.length===0?<div className="empty-state"><span className="empty-icon">↗</span><b>Sua primeira entrada começa aqui</b><p>Cadastre um serviço acima para começar a visualizar sua movimentação.</p></div>:<div className="income-table">{records.map(record=><article key={record.id} className="income-row"><span className="income-row-icon">↗</span><div className="income-row-main"><b>{record.service}</b><small>{dateLabel(record.date)} · {record.quantity} serviço(s)</small></div><strong>{money(Math.round(record.unit_cents*record.quantity))}</strong><span className={`status-chip ${record.received?"status-done":"status-open"}`}>{record.received?"Recebido":"Previsto"}</span></article>)}</div>}</section></>;
}
