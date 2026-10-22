import Link from "next/link";
import { Activity, ArrowDownLeft, ArrowRight, CalendarDays, Calculator, ChartNoAxesCombined, CreditCard, ReceiptText } from "lucide-react";
import type { FinanceSnapshot, IncomeRecord } from "@/features/finance/repository/income_repository";
import { Greeting } from "../viewmodel/greeting";

function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}
function rows(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value) ? value.filter((row): row is Record<string, unknown> => !!row && typeof row === "object") : [];
}
function number(value: unknown) { const result = Number(value); return Number.isFinite(result) ? result : 0; }
function str(value: unknown) { return value == null ? "" : String(value); }
function monthInSaoPaulo() {
  const month = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit" }).format(new Date());
  return month;
}
function netIncome(record: IncomeRecord, taxPercent: number, investments: Array<Record<string, unknown>>) {
  const gross = Math.round(number(record.unit_cents) * number(record.quantity));
  const netAfterTax = number(record.tax_applies) === 1 ? Math.round(gross * (100 - taxPercent) / 100) : gross;
  const ids = str((record as IncomeRecord & { investment_ids?: string }).investment_ids);
  const applicable = ids === "*" || !ids
    ? investments
    : investments.filter((investment) => ids.split(",").includes(str(investment.id)));
  const percent = applicable.filter((item) => item.mode === "percent").reduce((sum, item) => sum + number(item.value), 0);
  let remaining = netAfterTax - Math.floor(netAfterTax * percent / 100);
  let fixed = 0;
  for (const rule of applicable.filter((item) => item.mode === "fixed")) {
    const amount = Math.min(Math.max(0, number(rule.value)), remaining);
    fixed += amount;
    remaining -= amount;
  }
  return Math.max(0, Math.min(netAfterTax, netAfterTax - Math.floor(netAfterTax * percent / 100) - fixed));
}

export function DashboardView({ name, snapshot }: { name: string; snapshot: FinanceSnapshot }) {
  const month = monthInSaoPaulo();
  const currentDate = new Date(`${month}-01T12:00:00`);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(currentDate);
  const incomes = rows(snapshot.incomes) as unknown as IncomeRecord[];
  const expenses = rows(snapshot.expenses);
  const cardExpenses = rows(snapshot.card_expenses);
  const cards = rows(snapshot.cards);
  const investments = rows(snapshot.investments);
  const taxSetting = rows(snapshot.settings).find((setting) => setting.key === "tax_percent");
  const taxPercent = number(taxSetting?.value);
  const monthIncomes = incomes.filter((record) => record.receive_month === month);
  const incomeTotal = monthIncomes.reduce((sum, record) => sum + netIncome(record, taxPercent, investments), 0);
  const monthExpenses = expenses.filter((expense) => expense.month === month);
  const monthCardExpenses = cardExpenses.filter((expense) => expense.month === month);
  const plannedTotal = monthExpenses.reduce((sum, expense) => sum + number(expense.amount_cents), 0);
  const cardTotal = monthCardExpenses.reduce((sum, expense) => sum + number(expense.amount_cents), 0);
  const totalExpenses = plannedTotal + cardTotal;
  const projected = incomeTotal - totalExpenses;
  const nextCommitments = [
    ...monthExpenses.filter((item) => number(item.paid) !== 1).map((item) => ({ title: str(item.title) || "Despesa planejada", detail: str(item.due_date) ? `Vence em ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${str(item.due_date)}T12:00:00`))}` : `Planejada • ${str(item.category)}`, cents: number(item.amount_cents), date: str(item.due_date) || `${month}-99` })),
    ...monthCardExpenses.filter((item) => number(item.paid) !== 1).map((item) => ({ title: str(item.title) || "Compra no cartão", detail: `Parcela ${number(item.installment_index) || 1} de ${number(item.installment_count) || 1}`, cents: number(item.amount_cents), date: `${month}-99` })),
  ].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const recent = [...monthIncomes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const valuesByDay = new Array<number>(days).fill(0);
  monthIncomes.forEach((record) => {
    const day = Number(new Intl.DateTimeFormat("en", { timeZone: "America/Sao_Paulo", day: "2-digit" }).format(new Date(record.date)));
    if (day >= 1 && day <= days) valuesByDay[day - 1] += netIncome(record, taxPercent, investments);
  });
  let accumulated = 0;
  const points = valuesByDay.map((value, index) => {
    accumulated += value;
    return { x: (560 * index) / Math.max(1, days - 1), y: 140 - (accumulated / Math.max(incomeTotal, 1)) * 108 };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L560 151 L0 151 Z`;

  return <>
    <div className="panel-welcome"><div><span className="panel-eyebrow">SEU RESUMO FINANCEIRO</span><h1><Greeting name={name}/></h1><p>Veja como estão suas finanças em {monthLabel}.</p></div><span className="month-select">{monthLabel} ⌄</span></div>
    <section className="metrics-grid">
      <article className="metric-card main-metric"><span className="metric-label">Saldo projetado <span><Activity size={14}/></span></span><strong>{money(projected)}</strong><small>Entradas líquidas menos as despesas do mês</small></article>
      <article className="metric-card"><span className="metric-label">Entradas líquidas <span><ArrowDownLeft size={15}/></span></span><strong>{money(incomeTotal)}</strong><small>{monthIncomes.length} {monthIncomes.length === 1 ? "entrada" : "entradas"} no mês</small></article>
      <article className="metric-card"><span className="metric-label">Despesas previstas <span><ReceiptText size={14}/></span></span><strong>{money(totalExpenses)}</strong><small>Planejadas + cartão</small></article>
    </section>
    <section className="dashboard-grid">
      <article className="panel-card cashflow-card"><div className="panel-section-title"><div><span className="panel-eyebrow">ACOMPANHAMENTO</span><h2>Entradas líquidas no mês</h2></div><span className="month-select">Este mês</span></div>
        {monthIncomes.length === 0 ? <div className="empty-state"><span className="empty-icon"><ChartNoAxesCombined size={16}/></span><b>Seu gráfico começa com uma entrada</b><p>Cadastre um recebimento para acompanhar sua evolução neste mês.</p></div> : <><div className="cashflow-chart"><svg viewBox="0 0 560 160" preserveAspectRatio="none" role="img" aria-label="Entradas líquidas acumuladas ao longo do mês"><defs><linearGradient id="dashboardFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#B7F500" stopOpacity=".3"/><stop offset="1" stopColor="#B7F500" stopOpacity="0"/></linearGradient></defs><path className="chart-grid" d="M0 25H560M0 65H560M0 105H560M0 145H560"/><path className="chart-area" d={areaPath}/><path className="chart-line" d={linePath}/></svg></div><div className="chart-labels"><span>01</span><span>08</span><span>15</span><span>22</span><span>{days}</span></div></>}
      </article>
      <article className="panel-card activity-card"><div className="panel-section-title"><div><span className="panel-eyebrow">MOVIMENTAÇÕES</span><h2>Últimas entradas</h2></div><Link className="activity-link" href="/painel/entradas">Ver todas <ArrowRight size={13}/></Link></div>
        {recent.length === 0 ? <div className="empty-state"><span className="empty-icon">↗</span><b>Nenhuma entrada neste mês</b><p>As movimentações cadastradas aparecerão aqui.</p></div> : recent.map((record) => <div className="activity-row" key={record.id}><span className="activity-bullet"><ArrowDownLeft size={15}/></span><div className="activity-copy"><b>{record.service}</b><small>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(record.date))}</small></div><span className="activity-amount in">+ {money(netIncome(record, taxPercent, investments))}</span></div>)}
      </article>
    </section>
    <section className="dashboard-grid dashboard-details-grid">
      <article className="panel-card activity-card"><div className="panel-section-title"><div><span className="panel-eyebrow">ORGANIZAÇÃO</span><h2>Despesas planejadas</h2></div><span className="activity-amount">{money(plannedTotal)}</span></div>
        {monthExpenses.length === 0 ? <div className="empty-state"><b>Nenhuma despesa planejada</b><p>As despesas previstas para este mês aparecerão aqui.</p></div> : monthExpenses.slice(0, 5).map((item) => <div className="activity-row" key={`expense-${str(item.id)}`}><span className="activity-bullet"><ReceiptText size={15}/></span><div className="activity-copy"><b>{str(item.title)}</b><small>{str(item.category)} • {number(item.paid) === 1 ? "Paga" : "Pendente"}</small></div><span className="activity-amount">{money(number(item.amount_cents))}</span></div>)}
      </article>
      <article className="panel-card activity-card"><div className="panel-section-title"><div><span className="panel-eyebrow">FATURA DO MÊS</span><h2>Parcelas e compras no cartão</h2></div><span className="activity-amount">{money(cardTotal)}</span></div>
        {monthCardExpenses.length === 0 ? <div className="empty-state"><b>Nenhuma compra neste mês</b><p>Parcelas e compras da fatura aparecerão aqui.</p></div> : monthCardExpenses.slice(0, 5).map((item) => { const card = cards.find((entry) => str(entry.id) === str(item.card_id)); return <div className="activity-row" key={`card-${str(item.id)}`}><span className="activity-bullet"><CreditCard size={15}/></span><div className="activity-copy"><b>{str(item.title)}</b><small>{str(card?.name) || "Cartão"} • Parcela {number(item.installment_index) || 1} de {number(item.installment_count) || 1}</small></div><span className="activity-amount">{money(number(item.amount_cents))}</span></div>; })}
      </article>
    </section>
    <section className="dashboard-lower">
      <article className="panel-card activity-card"><div className="panel-section-title"><div><span className="panel-eyebrow">AGENDA FINANCEIRA</span><h2>Próximo compromisso</h2></div><CalendarDays size={16}/></div>
        {nextCommitments.length === 0 ? <div className="empty-state"><b>Nenhum compromisso pendente</b><p>Seus pagamentos pendentes do mês aparecerão aqui.</p></div> : nextCommitments.map((item, index) => <div className="activity-row" key={`${item.title}-${index}`}><span className="activity-bullet"><CalendarDays size={15}/></span><div className="activity-copy"><b>{item.title}</b><small>{item.detail}</small></div><span className="activity-amount">{money(item.cents)}</span></div>)}
      </article>
      <article className="panel-card calculation-teaser"><div className="teaser-header"><div><span className="panel-eyebrow">FERRAMENTA GRATUITA</span><h2>Faça uma simulação</h2></div><span><Calculator size={16}/></span></div><p>Estime quanto reservar para impostos e investimentos antes de decidir o próximo passo.</p><Link href="/painel/calculos">Abrir calculadora <ArrowRight size={14}/></Link></article>
    </section>
  </>;
}
