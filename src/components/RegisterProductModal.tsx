import React, { useState, useEffect } from "react";
import { 
  X, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Calculator, 
  DollarSign, 
  ArrowRight, 
  Store, 
  HelpCircle, 
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink
} from "lucide-react";
import { CatalogProduct } from "../types";

interface RegisterProductModalProps {
  product: CatalogProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessPublish: (updatedProduct: CatalogProduct) => void;
}

export const RegisterProductModal: React.FC<RegisterProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccessPublish
}) => {
  if (!isOpen || !product) return null;

  const [targetMarketplace, setTargetMarketplace] = useState<"Mercado Livre" | "Shopee" | "Amazon">("Mercado Livre");
  const [mlListingType, setMlListingType] = useState<"classico" | "premium">("premium");
  const [salePrice, setSalePrice] = useState<number>(product.suggestedSalePrice || 39.90);
  const [customTitle, setCustomTitle] = useState<string>(product.name);
  const [stockToPublish, setStockToPublish] = useState<number>(50);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);

  // Calculate fees & profit
  const commissionRate = targetMarketplace === "Mercado Livre" 
    ? (mlListingType === "premium" ? 0.16 : 0.11) 
    : targetMarketplace === "Shopee" ? 0.14 : 0.15;

  const fixedFee = (targetMarketplace === "Mercado Livre" && salePrice < 79) ? 6.00 : 0;
  const marketplaceFee = (salePrice * commissionRate) + fixedFee;
  const netProfit = salePrice - product.costPrice - marketplaceFee;
  const profitMarginPercent = salePrice > 0 ? ((netProfit / salePrice) * 100) : 0;
  const markupMultiplier = product.costPrice > 0 ? (salePrice / product.costPrice) : 1;

  // Generate 60-character title with AI
  const handleGenerateAITitle = async () => {
    setIsGeneratingTitle(true);
    try {
      const response = await fetch("/api/ml/optimize-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          brand: "Original",
          model: product.sku,
          category: product.category,
          keyFeatures: product.description,
          price: salePrice,
          condition: "new"
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.titles && data.titles.length > 0) {
          setTitleOptions(data.titles.map((t: any) => t.title));
          setCustomTitle(data.titles[0].title);
        }
      } else {
        const fallback = `${product.name.slice(0, 48)} Envio Rapido`.slice(0, 60);
        setTitleOptions([fallback, `${product.name.slice(0, 42)} Original Nfe`]);
        setCustomTitle(fallback);
      }
    } catch (err) {
      const fallback = `${product.name.slice(0, 48)} Pronta Entrega`.slice(0, 60);
      setCustomTitle(fallback);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      
      setTimeout(() => {
        const updatedProduct: CatalogProduct = {
          ...product,
          isRegistered: true,
          registeredStores: [...(product.registeredStores || []), `${targetMarketplace} Oficial`],
          registeredDate: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          syncedPrice: salePrice
        };
        onSuccessPublish(updatedProduct);
        onClose();
        setPublishSuccess(false);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div 
        id="modal-register-marketplace-container"
        className="bg-[#121216]/95 border border-white/[0.12] rounded-3xl w-full max-w-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden relative my-6 animate-in fade-in zoom-in duration-150 backdrop-blur-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#af52de]/15 text-[#d884ff] border border-[#af52de]/30 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#bf5af2]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Publicar no Marketplace com ForneceHub</h2>
              <p className="text-[11px] text-[#86868b]">Integração de estoque e precificação inteligente</p>
            </div>
          </div>
          <button
            id="close-register-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Product Summary Mini Card */}
          <div className="flex items-center gap-4 p-3.5 bg-black/50 rounded-2xl border border-white/[0.08]">
            <div className="w-14 h-14 bg-white rounded-xl p-1 flex items-center justify-center flex-shrink-0 shadow-sm">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-neutral-400 font-mono">SKU: {product.sku}</p>
              <h4 className="text-xs font-semibold text-white truncate tracking-tight">{product.name}</h4>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-neutral-400 font-mono">Custo ForneceHub: <strong className="text-emerald-400">R$ {product.costPrice.toFixed(2)}</strong></span>
                <span className="text-neutral-400">Estoque Disponível: <strong className="text-[#d884ff]">{product.stock} un</strong></span>
              </div>
            </div>
          </div>

          {/* 1. Target Marketplace Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 tracking-tight mb-2">
              1. Selecione o Marketplace de Destino
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTargetMarketplace("Mercado Livre")}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  targetMarketplace === "Mercado Livre"
                    ? "bg-white/[0.08] border-[#af52de] text-white shadow-[0_2px_12px_rgba(175,82,222,0.25)] ring-1 ring-[#af52de]"
                    : "bg-black/40 border-white/[0.08] text-neutral-400 hover:border-white/[0.2]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-400">Mercado Livre</span>
                  {targetMarketplace === "Mercado Livre" && <CheckCircle2 className="w-4 h-4 text-[#bf5af2]" />}
                </div>
                <span className="text-[11px] text-neutral-400">Loja Conectada (Ativa)</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetMarketplace("Shopee")}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  targetMarketplace === "Shopee"
                    ? "bg-white/[0.08] border-[#af52de] text-white shadow-[0_2px_12px_rgba(175,82,222,0.25)] ring-1 ring-[#af52de]"
                    : "bg-black/40 border-white/[0.08] text-neutral-400 hover:border-white/[0.2]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-400">Shopee Brasil</span>
                  {targetMarketplace === "Shopee" && <CheckCircle2 className="w-4 h-4 text-[#bf5af2]" />}
                </div>
                <span className="text-[11px] text-neutral-400">Loja Conectada (Ativa)</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetMarketplace("Amazon")}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                  targetMarketplace === "Amazon"
                    ? "bg-white/[0.08] border-[#af52de] text-white shadow-[0_2px_12px_rgba(175,82,222,0.25)] ring-1 ring-[#af52de]"
                    : "bg-black/40 border-white/[0.08] text-neutral-400 hover:border-white/[0.2]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-yellow-500">Amazon BR</span>
                  {targetMarketplace === "Amazon" && <CheckCircle2 className="w-4 h-4 text-[#bf5af2]" />}
                </div>
                <span className="text-[11px] text-neutral-400">Seller Central</span>
              </button>
            </div>
          </div>

          {/* Mercado Livre Listing Type */}
          {targetMarketplace === "Mercado Livre" && (
            <div className="bg-black/40 p-3.5 rounded-2xl border border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white block">Tipo de Anúncio ML:</span>
                <span className="text-[11px] text-neutral-400">
                  {mlListingType === "premium" 
                    ? "Premium: 16% comissão + Parcelamento 12x sem juros (Maior relevância)" 
                    : "Clássico: 11% comissão + Juros por conta do comprador"}
                </span>
              </div>
              <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setMlListingType("classico")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    mlListingType === "classico" ? "bg-white/[0.12] text-white border border-white/[0.1]" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Clássico (11%)
                </button>
                <button
                  type="button"
                  onClick={() => setMlListingType("premium")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    mlListingType === "premium" ? "bg-[#af52de] text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Premium (16%)
                </button>
              </div>
            </div>
          )}

          {/* 2. Title Optimization (60 characters limit) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300 tracking-tight">
                2. Título do Anúncio (Algoritmo ML)
              </label>
              <button
                type="button"
                onClick={handleGenerateAITitle}
                disabled={isGeneratingTitle}
                className="inline-flex items-center gap-1.5 text-xs text-[#d884ff] hover:text-white font-medium bg-[#af52de]/15 hover:bg-[#af52de]/25 px-3 py-1 rounded-xl border border-[#af52de]/30 transition disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-[#bf5af2] ${isGeneratingTitle ? "animate-spin" : ""}`} />
                {isGeneratingTitle ? "Gerando Título IA..." : "Otimizar Título com IA (60 Chars)"}
              </button>
            </div>
            
            <input
              id="input-custom-title"
              type="text"
              value={customTitle}
              maxLength={60}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#af52de] font-medium"
            />
            
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1 px-1">
              <span>Máximo do Mercado Livre: 60 caracteres</span>
              <span className={`font-mono font-semibold ${customTitle.length > 55 ? "text-emerald-400" : "text-[#d884ff]"}`}>
                {customTitle.length}/60 caracteres
              </span>
            </div>

            {titleOptions.length > 0 && (
              <div className="mt-2 space-y-1 bg-black/40 p-2.5 rounded-2xl border border-white/[0.08]">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase block">Sugestões ForneceHub IA:</span>
                {titleOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomTitle(opt)}
                    className="w-full text-left text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] p-1.5 rounded-xl transition flex items-center justify-between group"
                  >
                    <span className="truncate">{opt}</span>
                    <span className="text-[10px] text-[#bf5af2] group-hover:text-[#d884ff] ml-2 font-mono">
                      {opt.length}c • Aplicar
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Pricing & Real Profit Calculation */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 tracking-tight flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                3. Preço de Venda e Margem Real
              </label>
              <span className="text-xs text-neutral-400 font-mono">
                Markup: <strong className="text-[#d884ff]">{markupMultiplier.toFixed(1)}x</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Preço de Venda Final (R$):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold font-mono">R$</span>
                  <input
                    id="input-sale-price-calc"
                    type="number"
                    step="0.10"
                    min="1"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#af52de]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Estoque Inicial Anunciado:</label>
                <input
                  id="input-stock-allocation"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={stockToPublish}
                  onChange={(e) => setStockToPublish(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/60 border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#af52de]"
                />
              </div>
            </div>

            {/* Detailed Financial Breakdown */}
            <div className="bg-black/60 p-3 rounded-xl border border-white/[0.06] space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>(-) Custo do Produto ForneceHub:</span>
                <span className="font-mono text-red-400">- R$ {product.costPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>(-) Taxa Marketplace ({targetMarketplace}):</span>
                <span className="font-mono text-amber-400">- R$ {marketplaceFee.toFixed(2)} {fixedFee > 0 ? "(inclui R$ 6,00 fixa)" : ""}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-white block">Lucro Líquido Real por Venda:</span>
                  <span className="text-[11px] text-neutral-400">Margem líquida sobre a venda: <strong className="text-emerald-400 font-mono">{profitMarginPercent.toFixed(1)}%</strong></span>
                </div>
                <span className={`text-sm font-bold font-mono ${netProfit > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  R$ {netProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            Cancelar
          </button>

          <button
            id="confirm-publish-to-marketplace-btn"
            type="button"
            onClick={handlePublish}
            disabled={isPublishing || publishSuccess || !customTitle.trim()}
            className={`px-6 py-2.5 rounded-xl text-xs font-medium transition flex items-center gap-2 ${
              publishSuccess
                ? "bg-emerald-600 text-white"
                : "bg-[#af52de] hover:bg-[#bf5af2] text-white shadow-[0_2px_14px_rgba(175,82,222,0.35)] active:scale-95 disabled:opacity-50"
            }`}
          >
            {publishSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Anúncio Publicado no ForneceHub!
              </>
            ) : isPublishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Publicando no {targetMarketplace}...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Confirmar e Publicar no {targetMarketplace}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
