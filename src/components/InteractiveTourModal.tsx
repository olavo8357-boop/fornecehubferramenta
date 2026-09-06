import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Layers, 
  Zap, 
  ClipboardList, 
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import { MainNavTab } from "../types";

interface InteractiveTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: MainNavTab) => void;
}

export const InteractiveTourModal: React.FC<InteractiveTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bem-vindo ao ForneceHub",
      subtitle: "Sua central definitiva de produtos e vendas no Mercado Livre",
      description: "Conectamos você diretamente a um catálogo com 374 produtos pronta-entrega, cálculo de margem real, fotos com fundo branco profissional e automação de anúncios.",
      tabTarget: "catalogo" as MainNavTab,
      icon: Sparkles,
      actionText: "Começar Passo a Passo"
    },
    {
      title: "1. Explorando o Catálogo ForneceHub",
      subtitle: "Pesquisa por SKU, filtros de categoria e fotos de alta resolução",
      description: "Navegue pelos produtos disponíveis para envio imediato. Todas as imagens já estão no padrão 1200x1200px com fundo branco 100% puro para garantir máxima relevância no algoritmo do Mercado Livre.",
      tabTarget: "catalogo" as MainNavTab,
      icon: Layers,
      actionText: "Próximo Passo"
    },
    {
      title: "2. Cadastro em 1 Clique com IA",
      subtitle: "Geração de títulos de 60 caracteres e cálculo de lucro real",
      description: "Ao clicar em 'Cadastrar no Marketplace', nossa IA formula o título ideal respeitando as regras do Mercado Livre e calculando a margem líquida exata com base nas tarifas 2025.",
      tabTarget: "catalogo" as MainNavTab,
      icon: Zap,
      actionText: "Próximo Passo"
    },
    {
      title: "3. Pedidos e Emissão de Etiquetas",
      subtitle: "Gestão integrada de envios pelo Mercado Envios",
      description: "Quando uma venda for realizada, o pedido aparece na aba 'Pedidos'. Você imprime a etiqueta em 1 clique e nós cuidamos do despacho em até 24h.",
      tabTarget: "pedidos" as MainNavTab,
      icon: ClipboardList,
      actionText: "Concluir Guia"
    }
  ];

  const current = steps[currentStep];
  const StepIcon = current.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onNavigateToTab(current.tabTarget);
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md">
      <div 
        id="modal-interactive-tour"
        className="bg-[#0a0715] border border-[#261d44] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#201838] bg-[#0e0a1f]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300">Guia ForneceHub</span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400">Passo {currentStep + 1} de {steps.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-purple-900/20 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <StepIcon className="w-6 h-6 text-purple-400" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{current.title}</h3>
            <p className="text-xs font-semibold text-purple-300/80 mt-0.5">{current.subtitle}</p>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed bg-[#120d26] p-4 rounded-xl border border-[#261d44]">
            {current.description}
          </p>

          {/* Steps Progress Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? "w-6 bg-gradient-to-r from-purple-500 to-indigo-500" : "w-2 bg-[#261d44]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#201838] bg-[#0e0a1f] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white disabled:opacity-30 transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Anterior
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:from-[#4f46e5] hover:via-[#6d28d9] hover:to-[#7e22ce] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-600/30 active:scale-95"
          >
            {current.actionText} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

