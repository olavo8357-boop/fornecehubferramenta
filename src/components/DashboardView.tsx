import React, { useState, useMemo } from "react";
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Zap, 
  RotateCw, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from "lucide-react";
import { CatalogProduct, Order, MainNavTab } from "../types";
import { formatCurrency, getOrderTotal } from "../utils";

interface DashboardViewProps {
  products: CatalogProduct[];
  orders: Order[];
  walletBalance: number;
  onNavigateToTab: (tab: MainNavTab) => void;
  onOpenRegisterModal: (product: CatalogProduct) => void;
  isDarkMode: boolean;
}

type PeriodFilter = "7d" | "30d" | "12m";

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  orders,
  walletBalance,
  onNavigateToTab,
  onOpenRegisterModal,
  isDarkMode
}) => {
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [showGettingStarted, setShowGettingStarted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ index: number; date: string; value: number } | null>(null);

  // Dynamic greeting based on current time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  // Filter metrics based on period
  const totalSalesRevenue = useMemo(() => {
    return orders.reduce((acc, o) => acc + getOrderTotal(o), 0);
  }, [orders]);

  const ordersCount = orders.length;
  const averageTicket = ordersCount > 0 ? totalSalesRevenue / ordersCount : 0;
  const itemsSoldCount = orders.reduce((acc, o) => acc + (o.items?.length || o.quantity || 1), 0);

  // Status breakdown
  const statusCounts = useMemo(() => {
    return {
      pendente: orders.filter(o => o.status === "Pendente" || o.status === "Pronto para envio").length,
      confirmado: orders.filter(o => o.status === "Confirmado" || o.status === "Pago").length,
      processando: orders.filter(o => o.status === "Processando" || o.status === "Em separação").length,
      enviado: orders.filter(o => o.status === "Enviado" || o.status === "Em trânsito").length,
      entregue: orders.filter(o => o.status === "Entregue").length,
      cancelado: orders.filter(o => o.status === "Cancelado").length,
    };
  }, [orders]);

  // Chart date ticks generation based on period
  const chartPoints = useMemo(() => {
    if (period === "7d") {
      return [
        { date: "30/08", value: 0 },
        { date: "31/08", value: 0 },
        { date: "01/09", value: 0 },
        { date: "02/09", value: 0 },
        { date: "03/09", value: 0 },
        { date: "04/09", value: 0 },
        { date: "05/09", value: totalSalesRevenue > 0 ? totalSalesRevenue : 0 },
      ];
    }
    if (period === "12m") {
      return [
        { date: "Out/24", value: 0 },
        { date: "Nov/24", value: 0 },
        { date: "Dez/24", value: 0 },
        { date: "Jan/25", value: 0 },
        { date: "Fev/25", value: 0 },
        { date: "Mar/25", value: 0 },
        { date: "Abr/25", value: 0 },
        { date: "Mai/25", value: 0 },
        { date: "Jun/25", value: 0 },
        { date: "Jul/25", value: 0 },
        { date: "Ago/25", value: 0 },
        { date: "Set/25", value: totalSalesRevenue > 0 ? totalSalesRevenue : 0 },
      ];
    }
    // Default 30d (15 points matching screenshot)
    return [
      { date: "07/08", value: 0 },
      { date: "09/08", value: 0 },
      { date: "11/08", value: 0 },
      { date: "13/08", value: 0 },
      { date: "15/08", value: 0 },
      { date: "17/08", value: 0 },
      { date: "19/08", value: 0 },
      { date: "21/08", value: 0 },
      { date: "23/08", value: 0 },
      { date: "25/08", value: 0 },
      { date: "27/08", value: 0 },
      { date: "29/08", value: 0 },
      { date: "31/08", value: 0 },
      { date: "02/09", value: 0 },
      { date: "05/09", value: totalSalesRevenue > 0 ? totalSalesRevenue : 0 },
    ];
  }, [period, totalSalesRevenue]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header Greeting & Controls matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-white" : "text-neutral-900"
          }`}>
            {greeting}, teste
          </h1>
          <p className={`text-xs mt-0.5 ${
            isDarkMode ? "text-neutral-400" : "text-neutral-500"
          }`}>
            Resumo da operação
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period selector tabs [7d] [30d] [12m] */}
          <div className={`border p-1 rounded-xl flex items-center shadow-inner ${
            isDarkMode ? "bg-[#0e0a1f] border-[#201838]" : "bg-neutral-100 border-neutral-200"
          }`}>
            <button
              id="dash-filter-7d-btn"
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "7d"
                  ? isDarkMode 
                    ? "bg-[#1f163d] text-white shadow-sm border border-purple-500/40" 
                    : "bg-white text-purple-800 shadow-sm border border-purple-200"
                  : isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              7d
            </button>
            <button
              id="dash-filter-30d-btn"
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "30d"
                  ? isDarkMode 
                    ? "bg-[#1f163d] text-white shadow-sm border border-purple-500/40" 
                    : "bg-white text-purple-800 shadow-sm border border-purple-200"
                  : isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              30d
            </button>
            <button
              id="dash-filter-12m-btn"
              onClick={() => setPeriod("12m")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === "12m"
                  ? isDarkMode 
                    ? "bg-[#1f163d] text-white shadow-sm border border-purple-500/40" 
                    : "bg-white text-purple-800 shadow-sm border border-purple-200"
                  : isDarkMode ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              12m
            </button>
          </div>

          {/* Atualizar Button */}
          <button
            id="dash-refresh-btn"
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-medium transition active:scale-95 shadow-sm ${
              isDarkMode 
                ? "bg-[#0e0a1f] hover:bg-[#140e2b] border-[#201838] hover:border-purple-500/40 text-white" 
                : "bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isDarkMode ? "text-neutral-300" : "text-neutral-600"} ${isRefreshing ? "animate-spin text-purple-600" : ""}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* 2. "Primeiros passos" Getting Started Banner */}
      {showGettingStarted && (
        <div className="bg-[#0b0819]/90 border border-[#221744] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/[0.06] rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">Primeiros passos</h2>
                <span className="text-[11px] font-medium text-neutral-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/[0.06]">
                  0 de 3 concluídos
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Complete as etapas básicas para iniciar a operação da sua loja.
              </p>
            </div>

            <button
              id="dismiss-getting-started-btn"
              onClick={() => setShowGettingStarted(false)}
              className="p-1 text-neutral-500 hover:text-white hover:bg-white/[0.06] rounded-lg transition"
              title="Fechar primeiros passos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Conectar loja de vendas */}
            <div 
              onClick={() => onNavigateToTab("integracoes")}
              className="bg-[#0e0a22]/80 hover:bg-[#130d2e]/90 border border-[#261d4b] hover:border-purple-500/40 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.07] border border-white/[0.1] text-neutral-300 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug group-hover:text-purple-300 transition">
                      Conectar loja de vendas
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Integre Mercado Livre, Shopee ou Bling para sincronizar pedidos e estoque.
                    </p>
                  </div>
                </div>

                {/* Marketplace Badges */}
                <div className="flex items-center gap-2 pt-1 pl-9">
                  {/* Mercado Livre Pill */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffe600]/15 border border-[#ffe600]/30 text-[#ffe600] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffe600]"></span>
                    Mercado Livre
                  </span>
                  {/* Shopee Pill */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ee4d2d]/15 border border-[#ee4d2d]/30 text-[#ff7253] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ee4d2d]"></span>
                    Shopee
                  </span>
                  {/* Bling Pill */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#00ad58]/15 border border-[#00ad58]/30 text-[#34d399] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ad58]"></span>
                    Bling
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 group-hover:text-purple-300 transition font-medium">
                <span>Conectar loja</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Step 2: Escolher produtos no catálogo */}
            <div 
              onClick={() => onNavigateToTab("catalogo")}
              className="bg-[#0e0a22]/80 hover:bg-[#130d2e]/90 border border-[#261d4b] hover:border-purple-500/40 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.07] border border-white/[0.1] text-neutral-300 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug group-hover:text-purple-300 transition">
                      Escolher produtos no catálogo
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Explore o catálogo com estoque a pronta entrega e envio imediato.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 group-hover:text-purple-300 transition font-medium">
                <span>Ver catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Step 3: Publicar primeiro anúncio */}
            <div 
              onClick={() => onNavigateToTab("catalogo")}
              className="bg-[#0e0a22]/80 hover:bg-[#130d2e]/90 border border-[#261d4b] hover:border-purple-500/40 rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-white/[0.07] border border-white/[0.1] text-neutral-300 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-snug group-hover:text-purple-300 transition">
                      Publicar primeiro anúncio
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Defina sua margem de lucro e envie anúncios para sua loja conectada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400 group-hover:text-purple-300 transition font-medium">
                <span>Publicar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Metrics 4 Cards Row matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: PEDIDOS HOJE */}
        <div className="bg-[#0b0819]/90 border border-[#221744] p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              PEDIDOS HOJE
            </span>
            <div className="text-sky-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            0
          </div>
          <p className="text-[11px] text-neutral-400">
            0 no período de {period}
          </p>
        </div>

        {/* Card 2: FATURAMENTO */}
        <div className="bg-[#0b0819]/90 border border-[#221744] p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              FATURAMENTO
            </span>
            <div className="text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {formatCurrency(totalSalesRevenue)}
          </div>
          <p className="text-[11px] text-neutral-400">
            {period}
          </p>
        </div>

        {/* Card 3: TICKET MÉDIO */}
        <div className="bg-[#0b0819]/90 border border-[#221744] p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              TICKET MÉDIO
            </span>
            <div className="text-sky-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {formatCurrency(averageTicket)}
          </div>
          <p className="text-[11px] text-neutral-400">
            {ordersCount} pedidos · {period}
          </p>
        </div>

        {/* Card 4: ITENS VENDIDOS */}
        <div className="bg-[#0b0819]/90 border border-[#221744] p-4 rounded-2xl shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              ITENS VENDIDOS
            </span>
            <div className="text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {itemsSoldCount}
          </div>
          <p className="text-[11px] text-neutral-400">
            {period}
          </p>
        </div>
      </div>

      {/* 4. Middle Row: Faturamento Chart (Left ~68%) + Status da operação (Right ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Faturamento Chart */}
        <div className="lg:col-span-8 bg-[#0b0819]/90 border border-[#221744] rounded-2xl p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Faturamento</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Período selecionado</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-white font-mono">
                {formatCurrency(totalSalesRevenue)}
              </span>
            </div>
          </div>

          {/* Interactive Line Chart */}
          <div className="relative w-full h-64 mt-2">
            {/* SVG Plot */}
            <svg 
              className="w-full h-full overflow-visible" 
              viewBox="0 0 700 200" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Dotted Grid Lines (5 horizontal levels: R$ 4, R$ 3, R$ 2, R$ 1, R$ 0) */}
              <line x1="45" y1="20" x2="690" y2="20" stroke="#22183c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="45" y1="60" x2="690" y2="60" stroke="#22183c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="45" y1="100" x2="690" y2="100" stroke="#22183c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="45" y1="140" x2="690" y2="140" stroke="#22183c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="45" y1="175" x2="690" y2="175" stroke="#22183c" strokeWidth="1" />

              {/* Y-Axis text labels */}
              <text x="35" y="24" fill="#645d80" fontSize="10" textAnchor="end" fontFamily="monospace">R$ 4</text>
              <text x="35" y="64" fill="#645d80" fontSize="10" textAnchor="end" fontFamily="monospace">R$ 3</text>
              <text x="35" y="104" fill="#645d80" fontSize="10" textAnchor="end" fontFamily="monospace">R$ 2</text>
              <text x="35" y="144" fill="#645d80" fontSize="10" textAnchor="end" fontFamily="monospace">R$ 1</text>
              <text x="35" y="179" fill="#645d80" fontSize="10" textAnchor="end" fontFamily="monospace">R$ 0</text>

              {/* Data Line Path */}
              {(() => {
                const startX = 45;
                const endX = 690;
                const step = (endX - startX) / (chartPoints.length - 1);
                const baseY = 175;
                
                const pointsCoordinates = chartPoints.map((pt, idx) => {
                  const x = startX + idx * step;
                  // If value > 0, scale relative to 4, else stay at baseY
                  const y = pt.value > 0 ? Math.max(20, baseY - (pt.value / 4) * 155) : baseY;
                  return { x, y, pt };
                });

                const lineD = pointsCoordinates.reduce((acc, curr, idx) => {
                  return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
                }, "");

                const areaD = `${lineD} L ${pointsCoordinates[pointsCoordinates.length - 1].x} ${baseY} L ${pointsCoordinates[0].x} ${baseY} Z`;

                return (
                  <g>
                    {/* Area under curve */}
                    <path d={areaD} fill="url(#chartGradient)" />
                    {/* Glowing curve line */}
                    <path d={lineD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Interactive points */}
                    {pointsCoordinates.map((coord, idx) => (
                      <circle
                        key={idx}
                        cx={coord.x}
                        cy={coord.y}
                        r={hoveredDataPoint?.index === idx ? 5 : 3}
                        fill={coord.pt.value > 0 || hoveredDataPoint?.index === idx ? "#38bdf8" : "#0e0a22"}
                        stroke="#38bdf8"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredDataPoint({ index: idx, date: coord.pt.date, value: coord.pt.value })}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                    ))}
                  </g>
                );
              })()}
            </svg>

            {/* Hover Tooltip */}
            {hoveredDataPoint && (
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#170f35] border border-purple-500/40 text-white px-3 py-1.5 rounded-xl text-xs shadow-2xl flex items-center gap-2 pointer-events-none"
              >
                <span className="text-neutral-400 font-mono">{hoveredDataPoint.date}:</span>
                <span className="font-bold text-sky-300 font-mono">
                  {formatCurrency(hoveredDataPoint.value)}
                </span>
              </div>
            )}

            {/* X-Axis dates row below line */}
            <div className="flex justify-between items-center text-[10px] text-[#645d80] font-mono mt-2 pl-9 pr-2">
              {chartPoints.map((pt, idx) => (
                <span key={idx} className="truncate">{pt.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Status da operação */}
        <div className="lg:col-span-4 bg-[#0b0819]/90 border border-[#221744] rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white tracking-tight">Status da operação</h3>
              <span className="text-xs text-neutral-400 font-mono">{ordersCount} pedidos</span>
            </div>

            {/* Status breakdown items with matching dots */}
            <div className="divide-y divide-white/[0.04] text-xs">
              {/* Venda pendente */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                  <span className="text-neutral-300 font-medium">Venda pendente</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.pendente}</span>
              </div>

              {/* Confirmado */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                  <span className="text-neutral-300 font-medium">Confirmado</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.confirmado}</span>
              </div>

              {/* Processando */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
                  <span className="text-neutral-300 font-medium">Processando</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.processando}</span>
              </div>

              {/* Enviado */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block shadow-[0_0_8px_rgba(129,140,248,0.5)]"></span>
                  <span className="text-neutral-300 font-medium">Enviado</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.enviado}</span>
              </div>

              {/* Entregue */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-slate-300 inline-block shadow-[0_0_8px_rgba(203,213,225,0.4)]"></span>
                  <span className="text-neutral-300 font-medium">Entregue</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.entregue}</span>
              </div>

              {/* Cancelado */}
              <div className="py-3 flex items-center justify-between hover:bg-white/[0.02] px-1 rounded-lg transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
                  <span className="text-neutral-300 font-medium">Cancelado</span>
                </div>
                <span className="font-mono text-neutral-400 font-semibold">{statusCounts.cancelado}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: Top produtos + Últimos pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Top produtos */}
        <div className="bg-[#0b0819]/90 border border-[#221744] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight">Top produtos</h3>
            <button
              id="dash-see-all-catalog-btn"
              onClick={() => onNavigateToTab("catalogo")}
              className="text-xs text-neutral-400 hover:text-purple-300 font-medium transition flex items-center gap-1"
            >
              Ver catálogo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {products.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="bg-[#0e0a22]/70 hover:bg-[#130d2e] border border-[#241a46] hover:border-purple-500/40 p-3 rounded-xl flex items-center justify-between gap-3 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[220px] sm:max-w-xs">{prod.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      SKU: <span className="text-neutral-300">{prod.sku}</span> · Estoque: <span className="text-emerald-400">{prod.stock} un</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-right">
                  <div>
                    <span className="text-xs font-bold text-white font-mono block">
                      R$ {prod.suggestedSalePrice.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">
                      Lucro ~R$ {(prod.suggestedSalePrice - prod.costPrice).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenRegisterModal(prod)}
                    className="p-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-lg text-xs transition"
                    title="Publicar Anúncio"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Últimos pedidos */}
        <div className="bg-[#0b0819]/90 border border-[#221744] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white tracking-tight">Últimos pedidos</h3>
            <button
              id="dash-see-all-orders-btn"
              onClick={() => onNavigateToTab("pedidos")}
              className="text-xs text-neutral-400 hover:text-purple-300 font-medium transition flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-500 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-white">Nenhum pedido recente registrado</p>
              <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
                Quando suas vendas sincronizarem pelo Mercado Livre ou Shopee, elas aparecerão aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-[#0e0a22]/70 hover:bg-[#130d2e] border border-[#241a46] p-3 rounded-xl flex items-center justify-between text-xs transition"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white font-mono">#{order.orderNumber || order.id}</p>
                    <p className="text-[11px] text-neutral-400">{order.customerName || (order as any).buyerName || "Cliente"} · {order.date}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-white font-mono">
                      {formatCurrency(getOrderTotal(order))}
                    </p>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
