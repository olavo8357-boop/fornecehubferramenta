import React, { useState } from "react";
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RotateCcw,
  TrendingUp,
  Download,
  Calendar,
  ChevronDown,
  Search,
  Check
} from "lucide-react";
import { WalletTransaction } from "../types";
import { formatCurrency } from "../utils";

interface FinanceViewProps {
  balance: number;
  transactions: WalletTransaction[];
  onOpenWalletModal: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  balance,
  transactions,
  onOpenWalletModal
}) => {
  const [autoPayActive, setAutoPayActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedType, setSelectedType] = useState("Todos os tipos");

  // Metrics (matching screenshot)
  const saldoAtual = balance;
  const entradas = 0.00;
  const pagamentosFornecedores = 0.00;
  const reembolsos = 0.00;
  const movimentoPeriodo = 0.00;

  const topCards = [
    {
      id: "saldo-atual",
      label: "Saldo Atual",
      value: saldoAtual,
      icon: Wallet,
      iconColor: "text-emerald-400"
    },
    {
      id: "entradas",
      label: "Entradas",
      value: entradas,
      icon: ArrowUpRight,
      iconColor: "text-emerald-400"
    },
    {
      id: "pagamentos-fornecedores",
      label: "Pagamentos a fornecedores",
      value: pagamentosFornecedores,
      icon: ArrowDownLeft,
      iconColor: "text-rose-400"
    },
    {
      id: "reembolsos",
      label: "Reembolsos (pagina)",
      value: reembolsos,
      icon: RotateCcw,
      iconColor: "text-purple-400"
    },
    {
      id: "movimento-periodo",
      label: "Movimento no período",
      value: movimentoPeriodo,
      icon: TrendingUp,
      iconColor: "text-emerald-400"
    }
  ];

  // Dates for 90 days graph dots
  const timelineDates = [
    "08/06", "11/06", "14/06", "17/06", "20/06", "23/06", "26/06", "29/06", 
    "02/07", "05/07", "08/07", "11/07", "14/07", "17/07", "20/07", "23/07", 
    "26/07", "29/07", "01/08", "04/08", "07/08", "10/08", "13/08", "16/08", 
    "19/08", "22/08", "25/08", "28/08", "31/08", "04/09"
  ];

  // Empty transactions filter for current view
  const currentTransactions: WalletTransaction[] = [];

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Descricao,Tipo,Valor,Data,Status\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `extrato_financeiro_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1600px] mx-auto select-none">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Financeiro</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pagamentos a fornecedores, reembolsos e saldo.
          </p>
        </div>

        {/* Action Buttons on Right: Auto-pagar toggle + Adicionar Saldo */}
        <div className="flex items-center gap-2.5">
          {/* Auto-pagar toggle pill */}
          <button
            id="btn-auto-pagar-toggle"
            onClick={() => setAutoPayActive(!autoPayActive)}
            className="px-3.5 py-1.5 bg-[#0a1526] hover:bg-[#0e1d35] border border-[#163056] text-[#38bdf8] hover:text-sky-300 rounded-lg text-xs font-medium flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            {/* Custom toggle slider icon */}
            <div className={`w-6 h-3.5 rounded-full p-0.5 flex items-center transition-colors ${
              autoPayActive ? "bg-[#38bdf8] justify-end" : "bg-neutral-700 justify-start"
            }`}>
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow"></div>
            </div>
            <span>Auto-pagar</span>
          </button>

          {/* Adicionar Saldo Button (Purple/Indigo solid button) */}
          <button
            id="btn-adicionar-saldo"
            onClick={onOpenWalletModal}
            className="px-4 py-1.5 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Adicionar Saldo</span>
          </button>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {topCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={`card-${card.id}`}
              className="bg-[#0d111a] border border-[#182030] p-4 rounded-xl flex flex-col justify-between min-h-[95px]"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#131926] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium truncate">
                  {card.label}
                </span>
              </div>
              <div className="mt-3 text-xl font-bold text-white tracking-tight font-sans">
                {formatCurrency(card.value)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Saldo Acumulado Chart Box */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-white tracking-tight">
            Saldo acumulado
          </h2>
          <span className="text-[11px] text-neutral-500 font-normal">
            Saldo dos últimos 90 dias
          </span>
        </div>

        {/* Chart Area */}
        <div className="relative h-64 pt-2 flex flex-col justify-between border-t border-[#131822]/60">
          {/* Y Axis Grid lines */}
          <div className="space-y-12 text-[10px] text-neutral-500 font-sans">
            <div className="flex items-center gap-2">
              <span className="w-7 text-right">R$ 4</span>
              <div className="flex-1 border-b border-dashed border-[#141b29]"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 text-right">R$ 3</span>
              <div className="flex-1 border-b border-dashed border-[#141b29]"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 text-right">R$ 2</span>
              <div className="flex-1 border-b border-dashed border-[#141b29]"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 text-right">R$ 1</span>
              <div className="flex-1 border-b border-dashed border-[#141b29]"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-7 text-right">R$ 0</span>
              <div className="flex-1 border-b border-[#141b29]"></div>
            </div>
          </div>

          {/* Points Timeline Line at R$ 0 level */}
          <div className="absolute bottom-6 left-10 right-2 flex items-center justify-between overflow-x-auto pb-1">
            {timelineDates.map((d, index) => (
              <div key={index} className="flex flex-col items-center group relative cursor-pointer">
                {/* Dot */}
                <div className="w-2 h-2 rounded-full bg-neutral-300 group-hover:scale-125 group-hover:bg-sky-400 transition mb-1"></div>
                {/* Date label */}
                <span className="text-[9px] text-neutral-500 group-hover:text-neutral-300 transition whitespace-nowrap">
                  {d}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Export Toolbar */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-xl p-2.5 flex flex-col xl:flex-row items-stretch xl:items-center gap-2.5 shadow-sm">
        {/* Search input with search icon */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="finance-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descricao..."
            className="w-full bg-transparent border-0 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Date Inputs */}
        <div className="relative">
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none w-full sm:w-32"
          />
          <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="dd/mm/aaaa"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none w-full sm:w-32"
          />
          <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Todos os tipos */}
        <div className="relative">
          <select
            id="filter-type-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todos os tipos">Todos os tipos</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
            <option value="Reembolso">Reembolso</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Counter text */}
        <div className="text-xs text-neutral-400 self-center px-1 whitespace-nowrap">
          {currentTransactions.length} transacoes
        </div>

        {/* Export CSV Button (Blue solid button with download icon) */}
        <button
          id="btn-export-finance-csv"
          onClick={handleExportCsv}
          className="px-3.5 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar CSV</span>
        </button>
      </div>

      {/* Main Content Area: Empty State matching screenshot */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-xl min-h-[360px] flex items-center justify-center text-center p-8">
        <span className="text-xs text-neutral-400 font-normal">
          Nenhuma transacao encontrada.
        </span>
      </div>
    </div>
  );
};

