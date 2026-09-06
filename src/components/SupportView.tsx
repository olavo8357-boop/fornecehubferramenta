import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronDown, 
  MessageSquare, 
  X 
} from "lucide-react";

export const SupportView: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos status");
  const [selectedPriority, setSelectedPriority] = useState("Todas prioridades");
  const [newTicketModal, setNewTicketModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Dúvidas Gerais");
  const [newPriority, setNewPriority] = useState("Média");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    setTickets([
      {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        status: "Aberto",
        updatedAt: "Agora mesmo"
      },
      ...tickets
    ]);
    setNewSubject("");
    setNewDescription("");
    setNewTicketModal(false);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = !searchTerm || t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Todos status" || t.status === selectedStatus;
    const matchesPriority = selectedPriority === "Todas prioridades" || t.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto select-none space-y-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Chamados</h1>
          <p className="text-xs text-neutral-400 mt-0.5">Suporte e atendimento.</p>
        </div>

        {/* Novo Chamado Button (+ Novo Chamado) */}
        <button
          id="btn-novo-chamado"
          onClick={() => setNewTicketModal(true)}
          className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Novo Chamado</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0a0d14] border border-[#182030] rounded-xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shadow-sm">
        {/* Search input with search icon */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="tickets-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por titulo ou #..."
            className="w-full bg-transparent border-0 pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>

        {/* Dropdown 1: Todos status */}
        <div className="relative">
          <select
            id="filter-ticket-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todos status">Todos status</option>
            <option value="Aberto">Aberto</option>
            <option value="Respondido">Respondido</option>
            <option value="Fechado">Fechado</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown 2: Todas prioridades */}
        <div className="relative">
          <select
            id="filter-ticket-priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="appearance-none bg-[#0e131d] border border-[#1e2738] rounded-lg px-3 py-1.5 pr-7 text-xs text-neutral-300 focus:outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="Todas prioridades">Todas prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Empty State / Ticket List */}
      {filteredTickets.length === 0 ? (
        <div className="bg-[#0a0d14] border border-[#182030] rounded-2xl min-h-[460px] flex flex-col items-center justify-center text-center p-8">
          <MessageSquare className="w-7 h-7 text-neutral-500 mb-2 stroke-[1.8]" />
          <span className="text-xs text-neutral-400 font-normal">
            Nenhum chamado encontrado.
          </span>
        </div>
      ) : (
        <div className="bg-[#0a0d14] border border-[#182030] rounded-xl overflow-hidden divide-y divide-[#182030]">
          {filteredTickets.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-[#0f1420] transition">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-semibold text-sky-400">{t.id}</span>
                <span className="text-xs text-white font-medium">{t.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Novo Chamado */}
      {newTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form onSubmit={handleCreateTicket} className="bg-[#0d111a] border border-[#1e2738] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-[#1e2738] pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Abrir Novo Chamado</span>
              </h3>
              <button type="button" onClick={() => setNewTicketModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Título / Assunto</label>
              <input
                type="text"
                required
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Ex: Dúvida sobre etiqueta de envio"
                className="w-full bg-[#131926] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#131926] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Dúvidas Gerais">Dúvidas Gerais</option>
                  <option value="Envios & Logística">Envios & Logística</option>
                  <option value="Catálogo & Estoque">Catálogo & Estoque</option>
                  <option value="Financeiro">Financeiro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Prioridade</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-[#131926] border border-[#222d40] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Mensagem</label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descreva detalhadamente sua solicitação..."
                className="w-full bg-[#131926] border border-[#222d40] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#1e2738]">
              <button type="button" onClick={() => setNewTicketModal(false)} className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95">
                Enviar Chamado
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

