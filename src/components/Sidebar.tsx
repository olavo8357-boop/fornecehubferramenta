import React, { useState } from "react";
import { 
  Home, 
  BookOpen, 
  Package, 
  ListOrdered, 
  Wallet, 
  Zap, 
  Bell, 
  MessageSquare, 
  Wrench, 
  GraduationCap, 
  Sparkles, 
  LogOut, 
  PanelLeftClose,
  PanelLeft,
  Eye, 
  EyeOff, 
  ChevronDown 
} from "lucide-react";
import { MainNavTab } from "../types";

interface SidebarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onOpenTour: () => void;
  pendingOrdersCount?: number;
  unreadNotificationsCount?: number;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTour,
  pendingOrdersCount = 0,
  unreadNotificationsCount = 0,
  isDarkMode
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  const navItems = [
    { id: "dashboard" as MainNavTab, label: "Dashboard", icon: Home },
    { id: "catalogo" as MainNavTab, label: "Catalogo", icon: BookOpen },
    { id: "meus-produtos" as MainNavTab, label: "Meus Produtos", icon: Package },
    { id: "pedidos" as MainNavTab, label: "Pedidos", icon: ListOrdered },
    { id: "financeiro" as MainNavTab, label: "Financeiro", icon: Wallet },
    { id: "integracoes" as MainNavTab, label: "Integracoes", icon: Zap },
    { id: "notificacoes" as MainNavTab, label: "Notificacoes", icon: Bell },
    { id: "chamados" as MainNavTab, label: "Chamados", icon: MessageSquare },
  ];

  return (
    <aside 
      className={`border-r flex flex-col justify-between transition-all duration-200 z-30 select-none ${
        isDarkMode ? "bg-[#0a0c10] border-[#151922]" : "bg-white border-neutral-200"
      } ${collapsed ? "w-16" : "w-56"}`}
    >
      <div>
        {/* Top Controls: Eye (Hide values) & Sidebar Toggle */}
        <div className={`h-12 flex items-center justify-end px-3 gap-1 border-b ${
          isDarkMode ? "border-[#151922]/60" : "border-neutral-200"
        }`}>
          <button
            id="toggle-values-visibility-btn"
            onClick={() => setShowValues(!showValues)}
            title={showValues ? "Ocultar valores" : "Mostrar valores"}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded transition"
          >
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-neutral-400" />}
          </button>
          <button
            id="collapse-sidebar-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className="p-1.5 text-neutral-400 hover:text-neutral-200 rounded transition"
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-btn`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[13px] transition-all relative ${
                  isActive
                    ? isDarkMode 
                      ? "bg-[#271547] text-[#c084fc] font-semibold border border-[#7c3aed]/40 shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                      : "bg-purple-100 text-purple-800 font-semibold border border-purple-300"
                    : isDarkMode 
                      ? "text-neutral-400 hover:text-neutral-200 hover:bg-[#121620]" 
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                } ${collapsed ? "justify-center px-0" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${
                  isActive 
                    ? isDarkMode ? "text-[#c084fc]" : "text-purple-700" 
                    : isDarkMode ? "text-neutral-400" : "text-neutral-500"
                }`} />
                {!collapsed && (
                  <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Ferramentas */}
          <div>
            <button
              id="nav-ferramentas-btn"
              onClick={() => {
                onSelectTab("ferramentas");
                setToolsOpen(!toolsOpen);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[13px] transition-all ${
                activeTab === "ferramentas"
                  ? isDarkMode 
                    ? "bg-[#271547] text-[#c084fc] font-semibold border border-[#7c3aed]/40 shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                    : "bg-purple-100 text-purple-800 font-semibold border border-purple-300"
                  : isDarkMode 
                    ? "text-neutral-400 hover:text-neutral-200 hover:bg-[#121620]" 
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? "Ferramentas" : undefined}
            >
              <Wrench className={`w-4 h-4 flex-shrink-0 ${
                activeTab === "ferramentas" 
                  ? isDarkMode ? "text-[#c084fc]" : "text-purple-700" 
                  : isDarkMode ? "text-neutral-400" : "text-neutral-500"
              }`} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left tracking-tight">Ferramentas</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${toolsOpen || activeTab === "ferramentas" ? "rotate-180" : ""}`} />
                </>
              )}
            </button>
          </div>

          {/* Tutoriais */}
          <button
            id="nav-tutoriais-btn"
            onClick={() => onSelectTab("tutoriais")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[13px] transition-all ${
              activeTab === "tutoriais"
                ? isDarkMode 
                  ? "bg-[#271547] text-[#c084fc] font-semibold border border-[#7c3aed]/40 shadow-[0_0_15px_rgba(124,58,237,0.2)]" 
                  : "bg-purple-100 text-purple-800 font-semibold border border-purple-300"
                : isDarkMode 
                  ? "text-neutral-400 hover:text-neutral-200 hover:bg-[#121620]" 
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            } ${collapsed ? "justify-center px-0" : ""}`}
            title={collapsed ? "Tutoriais" : undefined}
          >
            <GraduationCap className={`w-4 h-4 flex-shrink-0 ${
              activeTab === "tutoriais" 
                ? isDarkMode ? "text-[#c084fc]" : "text-purple-700" 
                : isDarkMode ? "text-neutral-400" : "text-neutral-500"
            }`} />
            {!collapsed && <span className="flex-1 text-left tracking-tight">Tutoriais</span>}
          </button>

          {/* Sair (in menu) */}
          <button
            id="nav-sair-btn"
            onClick={() => alert("Sessão ativa.")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${
              collapsed ? "justify-center px-0" : ""
            }`}
            title={collapsed ? "Sair" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-red-400" />
            {!collapsed && <span className="flex-1 text-left tracking-tight">Sair</span>}
          </button>
        </nav>
      </div>

      {/* Bottom area with Guia Interativo and Sair */}
      <div className="p-3 border-t border-[#151922] space-y-1.5">
        <button
          id="open-interactive-tour-btn"
          onClick={onOpenTour}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 font-medium text-xs transition ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Guia Interativo"
        >
          <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
          {!collapsed && <span className="tracking-tight">Guia Interativo</span>}
        </button>

        <button
          id="logout-sidebar-btn"
          onClick={() => alert("Sessão ativa.")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg font-medium text-xs transition ${
            collapsed ? "justify-center px-0" : ""
          }`}
          title="Sair"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="tracking-tight">Sair</span>}
        </button>
      </div>
    </aside>
  );
};

