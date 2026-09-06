import React, { useState } from "react";
import { 
  Plus, 
  Sun, 
  Moon, 
  Bell, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  LogOut, 
  Settings,
  Wallet
} from "lucide-react";
import { MainNavTab } from "../types";
import { formatCurrency } from "../utils";

interface HeaderProps {
  activeTab: MainNavTab;
  totalProductsCount: number;
  walletBalance: number;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  totalProductsCount,
  walletBalance,
  onOpenWallet,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  isDarkMode,
  onToggleTheme
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className={`h-12 border-b flex items-center justify-end px-4 z-20 select-none sticky top-0 transition-colors duration-300 ${
      isDarkMode ? "bg-[#0a0c10] border-[#151922]" : "bg-white border-neutral-200"
    }`}>
      {/* Right Controls: Balance + Theme Toggle + Bell + User Badge */}
      <div className="flex items-center gap-2">
        {/* Wallet Balance widget matching screenshot: Green badge with icon + amount + '+' button */}
        <div 
          id="header-wallet-balance-widget"
          className="flex items-center bg-[#072418] border border-[#0d4a2b] rounded-lg px-2.5 py-1 transition group"
        >
          <button 
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] hover:text-emerald-300 font-mono transition"
            title="Ver carteira"
          >
            <Wallet className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{formatCurrency(walletBalance)}</span>
          </button>
          <button 
            id="add-funds-plus-btn"
            onClick={onOpenWallet}
            className="w-4 h-4 rounded bg-[#0d4a2b]/80 hover:bg-[#12683d] text-[#10b981] flex items-center justify-center ml-2 transition active:scale-95"
            title="Recarregar saldo"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 transition rounded"
          title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-300" />}
        </button>

        {/* Notification Bell */}
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-1.5 text-neutral-400 hover:text-neutral-200 transition rounded"
          title="Ver notificações"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full"></span>
          )}
        </button>

        {/* User profile badge: Blue circle with 'T' and 'teste' with chevron */}
        <div className="relative ml-1">
          <button
            id="user-profile-menu-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 hover:bg-[#121620] rounded-lg px-2 py-1 transition"
          >
            <div className="w-6 h-6 rounded-full bg-[#1e40af] text-white font-bold text-xs flex items-center justify-center">
              T
            </div>
            <span className="text-xs font-normal text-neutral-300">teste</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {userDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-56 bg-[#0f131a] border border-[#1e2533] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in duration-150"
              onClick={() => setUserDropdownOpen(false)}
            >
              <div className="px-3 py-2 border-b border-[#1e2533]">
                <p className="font-semibold text-white text-xs">ForneceHub Vendedor</p>
                <p className="text-neutral-400 text-[11px] truncate">contato@fornecehub.com.br</p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" /> MercadoLíder Platinum
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <button 
                  id="user-menu-profile-btn"
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#171d29] flex items-center gap-2 transition"
                >
                  <User className="w-3.5 h-3.5 text-sky-400" /> Meus Dados & CNPJ
                </button>
                <button 
                  id="user-menu-settings-btn"
                  className="w-full text-left px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#171d29] flex items-center gap-2 transition"
                >
                  <Settings className="w-3.5 h-3.5 text-sky-400" /> Configurações
                </button>
              </div>

              <div className="pt-1 border-t border-[#1e2533]">
                <button 
                  id="user-menu-logout-btn"
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
