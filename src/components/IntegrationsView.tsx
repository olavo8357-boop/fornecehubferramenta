import React from "react";
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Plus,
  ShieldCheck,
  Store
} from "lucide-react";
import { StoreIntegration } from "../types";

interface IntegrationsViewProps {
  integrations: StoreIntegration[];
  onToggleConnect: (integrationId: string) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  onToggleConnect
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-2xl p-5 rounded-2xl border border-white/[0.08] shadow-lg">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">Integrações de Canais de Venda</h2>
          <p className="text-xs text-neutral-400">Conecte sua conta do Mercado Livre e sincronize catálogo em tempo real</p>
        </div>

        <button
          onClick={() => alert("Abrindo assistente de conexão de nova loja...")}
          className="px-4 py-2.5 bg-[#af52de] hover:bg-[#bf5af2] text-white rounded-xl text-xs font-medium transition flex items-center gap-2 shadow-[0_2px_14px_rgba(175,82,222,0.35)] active:scale-95"
        >
          <Plus className="w-4 h-4" /> Conectar Nova Loja
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-white/[0.2] rounded-2xl p-5 space-y-4 transition shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <img src={item.logo} alt={item.storeName} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white tracking-tight">{item.storeName}</h4>
                  <p className="text-xs text-neutral-400 font-mono">{item.accountName}</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                item.connected
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-white/[0.06] text-neutral-400"
              }`}>
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[10px] text-neutral-400 block">Produtos Sincronizados</span>
                <span className="text-xs font-semibold text-white">{item.syncedProducts} anúncios</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-[10px] text-neutral-400 block">Última Sincronização</span>
                <span className="text-xs font-medium text-[#d884ff]">{item.lastSync}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#bf5af2]" /> Token Oficial OAuth 2.0
              </span>

              <button
                onClick={() => onToggleConnect(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  item.connected
                    ? "bg-white/[0.06] text-neutral-300 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.08]"
                    : "bg-[#af52de] hover:bg-[#bf5af2] text-white shadow-[0_2px_10px_rgba(175,82,222,0.3)] active:scale-95"
                }`}
              >
                {item.connected ? "Desconectar" : "Conectar Loja"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
