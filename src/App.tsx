import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CatalogView } from "./components/CatalogView";
import { DashboardView } from "./components/DashboardView";
import { MyProductsView } from "./components/MyProductsView";
import { OrdersView } from "./components/OrdersView";
import { IntegrationsView } from "./components/IntegrationsView";
import { FinanceView } from "./components/FinanceView";
import { SupportView } from "./components/SupportView";
import { ToolsView } from "./components/ToolsView";
import { TutorialsView } from "./components/TutorialsView";
import { NotificationsView } from "./components/NotificationsView";
import { RegisterProductModal } from "./components/RegisterProductModal";
import { WalletModal } from "./components/WalletModal";
import { InteractiveTourModal } from "./components/InteractiveTourModal";
import { HelpChatWidget } from "./components/HelpChatWidget";
import { 
  CatalogProduct, 
  MainNavTab, 
  Order, 
  StoreIntegration, 
  WalletTransaction, 
  SavedListing 
} from "./types";
import { 
  INITIAL_PRODUCTS, 
  INITIAL_INTEGRATIONS, 
  INITIAL_ORDERS, 
  INITIAL_TRANSACTIONS 
} from "./data/catalog";
import { CheckCircle2, Bell, X, ExternalLink, Sparkles } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>("tutoriais");
  const [products, setProducts] = useState<CatalogProduct[]>(INITIAL_PRODUCTS);
  const [integrations, setIntegrations] = useState<StoreIntegration[]>(INITIAL_INTEGRATIONS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(INITIAL_TRANSACTIONS);
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedProductForRegister, setSelectedProductForRegister] = useState<CatalogProduct | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved listings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fornecehub_saved_listings") || localStorage.getItem("ml_saved_listings");
      if (saved) {
        setSavedListings(JSON.parse(saved));
      }
      const savedProds = localStorage.getItem("fornecehub_catalog_products") || localStorage.getItem("ml_catalog_products");
      if (savedProds) {
        setProducts(JSON.parse(savedProds));
      }
      const savedBalance = localStorage.getItem("fornecehub_wallet_balance") || localStorage.getItem("ml_wallet_balance");
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance) || 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenRegisterModal = (product: CatalogProduct) => {
    setSelectedProductForRegister(product);
    setRegisterModalOpen(true);
  };

  const handleSuccessPublish = (updatedProduct: CatalogProduct) => {
    setProducts((prev) => {
      const newProds = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      try {
        localStorage.setItem("fornecehub_catalog_products", JSON.stringify(newProds));
      } catch (e) {}
      return newProds;
    });

    // Add activity notification & toast
    showToast(`"${updatedProduct.name.slice(0, 38)}..." publicado com sucesso pelo ForneceHub!`);
  };

  const handleAddFunds = (amount: number, method: "PIX" | "Cartão") => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    try {
      localStorage.setItem("fornecehub_wallet_balance", newBalance.toString());
    } catch (e) {}

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: "credit",
      title: `Recarga de Saldo ForneceHub via ${method}`,
      amount,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      paymentMethod: method,
      status: "Concluído"
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Recarga de R$ ${amount.toFixed(2)} confirmada via ${method}!`);
  };

  const handleToggleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id === integrationId) {
          const nextState = !item.connected;
          return {
            ...item,
            connected: nextState,
            status: nextState ? "Ativo" : "Desconectado",
            lastSync: nextState ? "Agora mesmo" : item.lastSync
          };
        }
        return item;
      })
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Status do pedido atualizado para "${status}".`);
  };

  const handleSaveListing = (listing: SavedListing) => {
    setSavedListings((prev) => {
      const updated = [listing, ...prev];
      try {
        localStorage.setItem("fornecehub_saved_listings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast("Anúncio salvo com sucesso em Anúncios Salvos!");
  };

  const handleDeleteSavedListing = (id: string) => {
    setSavedListings((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem("fornecehub_saved_listings", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <div 
      style={{
        ["--bg-color" as any]: isDarkMode ? "#030008" : "#f8fafc",
        ["--text-color" as any]: isDarkMode ? "#f8fafc" : "#0f172a"
      }}
      className={`min-h-screen flex font-sans antialiased relative overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#030008] text-neutral-100" : "bg-[#f8fafc] text-neutral-900"
      }`}
    >
      {/* Background Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[500px] bg-sky-950/10 rounded-full blur-[160px]"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#120d26] border border-[#261d44] text-white px-4 py-3 rounded-2xl shadow-2xl shadow-purple-950/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white ml-2 transition">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTour={() => setTourModalOpen(true)}
        pendingOrdersCount={orders.filter((o) => o.status === "Pronto para envio").length}
        isDarkMode={isDarkMode}
      />

      {/* Main Container: Top Header + Dynamic View */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 transition-colors duration-300 ${
        isDarkMode ? "bg-[#030008]" : "bg-white"
      }`}>
        <Header
          activeTab={activeTab}
          totalProductsCount={products.length}
          walletBalance={walletBalance}
          onOpenWallet={() => setWalletModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(!notificationsOpen)}
          unreadNotificationsCount={2}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 overflow-y-auto pb-16">
          {activeTab === "catalogo" && (
            <CatalogView
              products={products}
              onOpenRegisterModal={handleOpenRegisterModal}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardView
              products={products}
              orders={orders}
              walletBalance={walletBalance}
              onNavigateToTab={setActiveTab}
              onOpenRegisterModal={handleOpenRegisterModal}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === "meus-produtos" && (
            <MyProductsView
              products={products}
              onNavigateToTab={setActiveTab}
              onOpenRegisterModal={handleOpenRegisterModal}
            />
          )}

          {activeTab === "pedidos" && (
            <OrdersView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {activeTab === "financeiro" && (
            <FinanceView
              balance={walletBalance}
              transactions={transactions}
              onOpenWalletModal={() => setWalletModalOpen(true)}
            />
          )}

          {activeTab === "integracoes" && (
            <IntegrationsView
              integrations={integrations}
              onToggleConnect={handleToggleConnect}
            />
          )}

          {activeTab === "notificacoes" && (
            <NotificationsView />
          )}

          {activeTab === "chamados" && <SupportView />}

          {activeTab === "ferramentas" && (
            <ToolsView
              savedListings={savedListings}
              onDeleteSavedListing={handleDeleteSavedListing}
              onSaveListing={handleSaveListing}
            />
          )}

          {activeTab === "tutoriais" && <TutorialsView />}
        </main>
      </div>

      {/* 1-Click Register Marketplace Modal */}
      <RegisterProductModal
        product={selectedProductForRegister}
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccessPublish={handleSuccessPublish}
      />

      {/* Wallet Balance Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        balance={walletBalance}
        transactions={transactions}
        onAddFunds={handleAddFunds}
      />

      {/* Interactive Walkthrough Tour Modal */}
      <InteractiveTourModal
        isOpen={tourModalOpen}
        onClose={() => setTourModalOpen(false)}
        onNavigateToTab={setActiveTab}
      />

      {/* Floating Support & SAC AI Chat Widget */}
      <HelpChatWidget />
    </div>
  );
}
