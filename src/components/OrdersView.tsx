import React, { useState } from "react";
import { 
  Download, 
  Tag, 
  Upload, 
  Search, 
  Calendar, 
  ChevronDown,
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  CheckCheck, 
  XCircle,
  Plus,
  X
} from "lucide-react";
import { Order } from "../types";

interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateOrderStatus
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos status");
  const [selectedChannel, setSelectedChannel] = useState("Todos canais");
  const [selectedShippingChannel, setSelectedShippingChannel] = useState("Todos canais de envio");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMetric, setSelectedMetric] = useState<string>("total-pedidos");

  // Modal manual order / import
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Calculate metrics based on actual orders
  const totalPedidos = orders.length;
  const totalProdutos = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const aguardandoPagamento = orders.filter((o) => o.status === "Pendente").length;
  const pagos = orders.filter((o) => o.status === "Pronto para envio").length;
  const enviados = orders.filter((o) => o.status === "Enviado").length;
  const entregues = orders.filter((o) => o.status === "Entregue").length;
  const cancelados = orders.filter((o) => o.status === "Cancelado").length;

  const statCards = [
    {
      id: "total-pedidos",
      label: "Total Pedidos",
      value: totalPedidos,
      icon: Package,
      iconColor: "text-sky-400",
      activeBorder: true
    },
    {
      id: "total-produtos",
      label: "Total Produtos",
      value: totalProdutos,
      icon: Package,
      iconColor: "text-sky-400"
    },
    {
      id: "aguard-pagamento",
      label: "Aguard. Pagamento",
      value: aguardandoPagamento,
      icon: Clock,
      iconColor: "text-amber-400"
    },
    {
      id: "pagos",
      label: "Pagos",
      value: pagos,
      icon: CheckCircle2,
      iconColor: "text-emerald-400"
    },
    {
      id: "enviados",
      label: "Enviados",
      value: enviados,
      icon: Truck,
      iconColor: "text-sky-400"
    },
    {
      id: "entregues",
      label: "Entregues",
      value: entregues,
      icon: CheckCheck,
      iconColor: "text-neutral-300"
    },
    {
      id: "cancelados",
      label: "Cancelados",
      value: cancelados,
      icon: XCircle,
      iconColor: "text-rose-500"
    }
  ];

  const filteredOrders = orders.filter((o) => {
    const customer = (o.customerName || "").toLowerCase();
    const prod = (o.productName || "").toLowerCase();
    const id = (o.id || o.orderNumber || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = !searchTerm || id.includes(search) || prod.includes(search) || customer.includes(search);
    const matchesChannel = selectedChannel === "Todos canais" || o.marketplace === selectedChannel;
    
    let matchesStatus = true;
    if (selectedStatus !== "Todos status") {
      if (selectedStatus === "Pagos") matchesStatus = o.status === "Pronto para envio";
      else if (selectedStatus === "Aguard. Pagamento") matchesStatus = o.status === "Pendente";
      else if (selectedStatus === "Enviados") matchesStatus = o.status === "Enviado";
      else if (selectedStatus === "Entregues") matchesStatus = o.status === "Entregue";
      else if (selectedStatus === "Cancelados") matchesStatus = o.status === "Cancelado";
    }

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID Pedido,Canal,Cliente,Produto,Qtd,Status,Data\n" +
      orders.map(e => `${e.orderNumber || e.id},${e.marketplace},${e.customerName},"${e.productName}",${e.quantity},${e.status},${e.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pedidos_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1600px] mx-auto select-none">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Pedidos</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Gerencie e acompanhe todos os pedidos.
          </p>
        </div>

        {/* Action Buttons on Right */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Export CSV Button */}
          <button
            id="btn-export-orders-csv"
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-[#111622] hover:bg-[#182030] border border-[#1e2738] text-neutral-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Pedidos (CSV)</span>
          </button>

          {/* + Pedido Manual Button (Green outline/bg) */}
          <button
            id="btn-manual-order"
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#08281a] hover:bg-[#0c3825] border border-[#125838] text-[#10b981] hover:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>+ Pedido Manual</span>
          </button>

          {/* Importar Pedido Button (Dark blue background with blue text) */}
          <button
            id="btn-import-order"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#0d2238] hover:bg-[#13304e] border border-[#18426d] text-[#38bdf8] hover:text-sky-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Pedido</span>
          </button>
        </div>
      </div>

      {/* Metrics Row 1: First 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.slice(0, 6).map((card) => {
          const Icon = card.icon;
          const isSelected = selectedMetric === card.id;

          return (
            <div
              key={card.id}
              id={`metric-card-${card.id}`}
              onClick={() => setSelectedMetric(card.id)}
              className={`bg-[#0d111a] p-4 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? "border border-[#2563eb] shadow-[0_0_0_1px_rgba(37,99,235,0.4)]"
                  : "border border-[#182030] hover:border-[#222d42]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#131926] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium truncate">
                  {card.label}
                </span>
              </div>
              <div className="mt-2 text-xl font-bold text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Row 2: Cancelados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.slice(6, 7).map((card) => {
          const Icon = card.icon;
          const isSelected = selectedMetric === card.id;

          return (
            <div
              key={card.id}
              id={`metric-card-${card.id}`}
              onClick={() => setSelectedMetric(card.id)}
              className={`bg-[#0d111a] p-4 rounded-xl cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? "border border-[#2563eb] shadow-[0_0_0_1px_rgba(37,99,235,0.4)]"
                  : "border border-[#182030] hover:border-[#222d42]"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#131926] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium truncate">
                  {card.label}
                </span>
              </div>
              <div className="mt-2 text-xl font-bold text-white tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-xl p-2.5 flex flex-col xl:flex-row items-stretch xl:items-center gap-2.5 shadow-sm">
        {/* Search input with search icon */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="orders-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por numero do pedido ou cliente..."
            className="w-full bg-transparent border-0 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Dropdown 1: Todos status */}
        <div className="relative">
          <select
            id="filter-status-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todos status">Todos status</option>
            <option value="Aguard. Pagamento">Aguard. Pagamento</option>
            <option value="Pagos">Pagos</option>
            <option value="Enviados">Enviados</option>
            <option value="Entregues">Entregues</option>
            <option value="Cancelados">Cancelados</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Todos canais */}
        <div className="relative">
          <select
            id="filter-channel-select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todos canais">Todos canais</option>
            <option value="Mercado Livre">Mercado Livre</option>
            <option value="Shopee">Shopee</option>
            <option value="Amazon">Amazon</option>
            <option value="Magalu">Magalu</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 3: Todos canais de envio */}
        <div className="relative">
          <select
            id="filter-shipping-channel-select"
            value={selectedShippingChannel}
            onChange={(e) => setSelectedShippingChannel(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todos canais de envio">Todos canais de envio</option>
            <option value="Mercado Envios">Mercado Envios</option>
            <option value="Correios">Correios</option>
            <option value="Loggi">Loggi</option>
            <option value="Jadlog">Jadlog</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
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

        {/* Counter text */}
        <div className="text-xs text-neutral-400 self-center px-1 whitespace-nowrap">
          {filteredOrders.length} pedidos
        </div>
      </div>

      {/* Main Content Area: Empty State matching screenshot */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#0a0d14] border border-[#182030] rounded-xl min-h-[380px] flex items-center justify-center text-center p-8">
          <span className="text-xs text-neutral-400 font-normal">
            Nenhum pedido encontrado.
          </span>
        </div>
      ) : (
        <div className="bg-[#0a0d14] border border-[#182030] rounded-xl overflow-hidden divide-y divide-[#182030]">
          {filteredOrders.map((order) => {
            const customer = order.customerName || (order as any).buyerName || "Cliente";
            const marketplace = order.marketplace || "Mercado Livre";
            const orderNum = order.orderNumber || order.id;

            return (
              <div key={order.id} className="p-4 space-y-2.5 hover:bg-[#0f1420] transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-sky-400">#{orderNum}</span>
                    <span className="text-xs text-neutral-400">• {order.date}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-medium border border-sky-500/20">
                      {marketplace}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${
                    order.status === "Pronto para envio" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    order.status === "Enviado" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                    order.status === "Cancelado" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <span className="text-neutral-200 font-medium">{order.productName}</span>
                  <span className="text-neutral-400">Comprador: <strong className="text-neutral-200">{customer}</strong> ({order.quantity} un.)</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Pedido Manual */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131a] border border-[#1e2738] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2738] pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Cadastrar Pedido Manual</span>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Insira os dados do pedido realizado diretamente fora dos canais integrados para gerar etiquetas e acompanhar o envio.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  className="w-full bg-[#141a24] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Canal de Venda</label>
                  <select className="w-full bg-[#141a24] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option>WhatsApp / Direto</option>
                    <option>Mercado Livre</option>
                    <option>Shopee</option>
                    <option>Instagram</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-[#141a24] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e2738]">
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert("Pedido manual criado com sucesso!");
                  setIsManualModalOpen(false);
                }}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold rounded-lg text-xs transition active:scale-95"
              >
                Salvar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Importar Pedido */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131a] border border-[#1e2738] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2738] pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Importar Planilha de Pedidos</span>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-dashed border-[#222d40] bg-[#141a24]/60 rounded-xl p-6 text-center">
              <Upload className="w-8 h-8 text-sky-400 mx-auto mb-2" />
              <p className="text-xs text-white font-medium">Arraste sua planilha .CSV ou .XLSX aqui</p>
              <p className="text-[11px] text-neutral-500 mt-1">Compatível com relatórios do Mercado Livre e Shopee</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1e2738]">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert("Arquivo selecionado para processamento.");
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg text-xs transition active:scale-95"
              >
                Processar Importação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

