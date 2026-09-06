import React from "react";
import { 
  Sparkles, 
  Calculator, 
  MessageSquareText, 
  ShieldCheck, 
  Camera, 
  Bookmark,
  ShoppingBag,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export type TabType = "optimizer" | "calculator" | "sac" | "auditor" | "photos" | "saved";

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  savedCount: number;
  apiHealthy: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  apiHealthy,
}) => {
  const tabs = [
    { id: "optimizer" as TabType, label: "Criador de Anúncio", icon: Sparkles, badge: "IA + SEO" },
    { id: "calculator" as TabType, label: "Calculadora de Lucro", icon: Calculator, badge: "Taxas 2026" },
    { id: "sac" as TabType, label: "Respostas Rápidas", icon: MessageSquareText, badge: "SAC Meli" },
    { id: "auditor" as TabType, label: "Auditor de Anúncio", icon: ShieldCheck, badge: "Diagnóstico" },
    { id: "photos" as TabType, label: "Guia de Fotos", icon: Camera, badge: "Catálogo" },
    { id: "saved" as TabType, label: "Salvos", icon: Bookmark, count: savedCount },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black">
              <ShoppingBag className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white font-sans">
                  Assistente de Vendas
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                  Mercado Livre
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Otimização de títulos, simulação de taxas e respostas com IA
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
              {apiHealthy === true ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-neutral-300 font-medium">Motor IA Ativo</span>
                </>
              ) : apiHealthy === false ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-neutral-300">Modo Heurístico ML</span>
                </>
              ) : (
                <span className="text-neutral-400">Verificando...</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-neutral-400"}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? "bg-neutral-950/20 text-neutral-950" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-neutral-950 text-amber-400" : "bg-amber-400 text-neutral-950"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
