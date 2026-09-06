import React, { useState } from "react";
import { Bell, Inbox } from "lucide-react";

export const NotificationsView: React.FC = () => {
  const [mainTab, setMainTab] = useState<"todas" | "nao-lidas" | "preferencias">("todas");
  const [categoryFilter, setCategoryFilter] = useState<string>("Todas");

  const categories = ["Todas", "Tokens & Contas", "Pedidos", "Financeiro", "Sistema"];

  return (
    <div className="p-8 max-w-[1600px] mx-auto select-none space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-sky-400 stroke-[2.2]" />
          <h1 className="text-xl font-bold text-white tracking-tight">
            Central de Notificações
          </h1>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Acompanhe avisos de tokens de marketplaces, pedidos pendentes e alertas operacionais da sua conta.
        </p>
      </div>

      {/* Main Tabs (Todas (0) | Não lidas | Preferências) */}
      <div className="flex items-center gap-2 border-b border-[#182030] pb-3">
        <button
          id="tab-todas"
          onClick={() => setMainTab("todas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            mainTab === "todas"
              ? "bg-[#162a45] text-[#38bdf8] border border-[#1e406a]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Todas (0)
        </button>

        <button
          id="tab-nao-lidas"
          onClick={() => setMainTab("nao-lidas")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            mainTab === "nao-lidas"
              ? "bg-[#162a45] text-[#38bdf8] border border-[#1e406a]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Não lidas
        </button>

        <button
          id="tab-preferencias"
          onClick={() => setMainTab("preferencias")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
            mainTab === "preferencias"
              ? "bg-[#162a45] text-[#38bdf8] border border-[#1e406a]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Preferências
        </button>
      </div>

      {/* Category Pills (Todas | Tokens & Contas | Pedidos | Financeiro | Sistema) */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1 rounded-md text-xs font-medium transition ${
              categoryFilter === cat
                ? "bg-[#0f172a] text-white border border-[#23334d]"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Empty State Container */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-2xl min-h-[380px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-12 h-12 rounded-2xl bg-[#0f1422] border border-[#1e2738] flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-xs font-semibold text-white tracking-tight">
          Nenhuma notificação encontrada
        </h3>
        <p className="text-[11px] text-neutral-500 mt-1 max-w-sm">
          Novos avisos e alertas da plataforma aparecerão aqui.
        </p>
      </div>
    </div>
  );
};
