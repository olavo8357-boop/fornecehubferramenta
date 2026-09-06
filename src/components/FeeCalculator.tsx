import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Truck, 
  Percent, 
  Package, 
  Sparkles,
  HelpCircle
} from "lucide-react";
import { ML_CATEGORIES, ML_RULES } from "../data/mlCategories";

export const FeeCalculator: React.FC = () => {
  // Inputs
  const [salePrice, setSalePrice] = useState<number>(149.90);
  const [productCost, setProductCost] = useState<number>(65.00);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("informatica");
  const [listingType, setListingType] = useState<"classico" | "premium">("premium");
  const [reputationDiscount, setReputationDiscount] = useState<number>(0.50); // 50% discount (Verde)
  const [taxRate, setTaxRate] = useState<number>(4.0); // 4% Simples Nacional
  const [packagingCost, setPackagingCost] = useState<number>(3.00);
  const [extraCost, setExtraCost] = useState<number>(0.00);

  // Target Profit Mode (Reverso)
  const [targetMode, setTargetMode] = useState<"margin" | "profit">("margin");
  const [targetValue, setTargetValue] = useState<number>(20); // 20% margin target

  // Active Category
  const category = useMemo(() => {
    return ML_CATEGORIES.find((c) => c.id === selectedCategoryId) || ML_CATEGORIES[0];
  }, [selectedCategoryId]);

  // Commission % based on type
  const commissionRate = listingType === "premium" ? category.premiumRate : category.classicoRate;

  // Calculation Function
  const calculateFinancials = (
    price: number,
    cost: number,
    type: "classico" | "premium",
    catRate: number,
    baseShipping: number
  ) => {
    const isUnder79 = price < ML_RULES.fixedFeeThreshold;
    const fixedFee = isUnder79 && price > 0 ? ML_RULES.fixedFeePerUnit : 0;
    const commissionVal = (price * catRate) / 100;
    
    // Shipping: only applies if >= 79
    const sellerShipping = isUnder79
      ? 0
      : Math.max(0, baseShipping * (1 - reputationDiscount));

    const taxVal = (price * taxRate) / 100;
    const totalMlCost = commissionVal + fixedFee + sellerShipping;
    const totalCost = cost + packagingCost + extraCost + taxVal + totalMlCost;
    const netProfit = price - totalCost;
    const netMargin = price > 0 ? (netProfit / price) * 100 : 0;
    const markupOnCost = cost > 0 ? ((price - cost) / cost) * 100 : 0;

    return {
      price,
      isUnder79,
      fixedFee,
      commissionVal,
      sellerShipping,
      taxVal,
      totalMlCost,
      totalCost,
      netProfit,
      netMargin,
      markupOnCost,
    };
  };

  // Current calculation
  const current = useMemo(() => {
    return calculateFinancials(
      salePrice,
      productCost,
      listingType,
      commissionRate,
      category.averageShipping
    );
  }, [salePrice, productCost, listingType, commissionRate, category, reputationDiscount, taxRate, packagingCost, extraCost]);

  // Comparison: Clássico vs Premium side by side
  const compClassico = useMemo(() => {
    return calculateFinancials(
      salePrice,
      productCost,
      "classico",
      category.classicoRate,
      category.averageShipping
    );
  }, [salePrice, productCost, category, reputationDiscount, taxRate, packagingCost, extraCost]);

  const compPremium = useMemo(() => {
    return calculateFinancials(
      salePrice,
      productCost,
      "premium",
      category.premiumRate,
      category.averageShipping
    );
  }, [salePrice, productCost, category, reputationDiscount, taxRate, packagingCost, extraCost]);

  // Breakeven price calculation (Price where netProfit = 0)
  // price = cost + packaging + extra + (price * taxRate/100) + (price * catRate/100) + fixedFee + shipping
  // price * (1 - (taxRate + catRate)/100) = cost + packaging + extra + fixedFee + shipping
  const breakevenPrice = useMemo(() => {
    const fixedCosts = productCost + packagingCost + extraCost;
    const variableFraction = (taxRate + commissionRate) / 100;

    if (variableFraction >= 1) return 0;

    // First test under 79
    const beUnder79 = (fixedCosts + ML_RULES.fixedFeePerUnit) / (1 - variableFraction);
    if (beUnder79 < 79) {
      return beUnder79;
    }

    // Else test over 79 with free shipping
    const shipping = Math.max(0, category.averageShipping * (1 - reputationDiscount));
    const beOver79 = (fixedCosts + shipping) / (1 - variableFraction);
    return beOver79;
  }, [productCost, packagingCost, extraCost, taxRate, commissionRate, category.averageShipping, reputationDiscount]);

  // Reverse Target Price Calculator:
  // "Quero lucrar targetValue % de margem ou R$ targetValue"
  const calculatedTargetPrice = useMemo(() => {
    const fixedCosts = productCost + packagingCost + extraCost;
    const rateFraction = (taxRate + commissionRate) / 100;

    if (targetMode === "margin") {
      const marginFraction = targetValue / 100;
      const denom = 1 - rateFraction - marginFraction;
      if (denom <= 0) return 0;

      // check if under 79
      const pUnder = (fixedCosts + ML_RULES.fixedFeePerUnit) / denom;
      if (pUnder < 79) return pUnder;

      const shipping = Math.max(0, category.averageShipping * (1 - reputationDiscount));
      return (fixedCosts + shipping) / denom;
    } else {
      // targetValue is R$ in profit
      const denom = 1 - rateFraction;
      if (denom <= 0) return 0;

      const pUnder = (fixedCosts + ML_RULES.fixedFeePerUnit + targetValue) / denom;
      if (pUnder < 79) return pUnder;

      const shipping = Math.max(0, category.averageShipping * (1 - reputationDiscount));
      return (fixedCosts + shipping + targetValue) / denom;
    }
  }, [targetMode, targetValue, productCost, packagingCost, extraCost, taxRate, commissionRate, category.averageShipping, reputationDiscount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#af52de]/15 border border-[#af52de]/30 text-[#d884ff] text-xs font-medium mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#bf5af2]" />
            <span>Simulador Financeiro Atualizado 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Calculadora de Taxas & Lucro Real no Mercado Livre
          </h2>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
            Descubra seu lucro líquido no bolso após deduzir comissão (Clássico ou Premium), taxa fixa de R$ 6,00 abaixo de R$ 79, frete Mercado Envios, impostos e custos operacionais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between tracking-tight">
              <span>Parâmetros de Venda</span>
              <span className="text-xs font-medium text-[#d884ff] font-mono">
                {category.name}
              </span>
            </h3>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Categoria do Produto
              </label>
              <select
                id="calc-category-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#af52de] transition"
              >
                {ML_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} (Clássico {cat.classicoRate}% | Premium {cat.premiumRate}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Listing Type Radio Buttons */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Tipo de Anúncio
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="btn-listing-classico"
                  onClick={() => setListingType("classico")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    listingType === "classico"
                      ? "bg-[#af52de]/15 border-[#af52de]/50 text-white ring-1 ring-[#af52de]/40"
                      : "bg-black/40 border-white/[0.06] text-neutral-400 hover:border-white/[0.12]"
                  }`}
                >
                  <div className="font-semibold text-xs text-white">Clássico</div>
                  <div className="text-[11px] text-[#d884ff] font-medium mt-0.5">
                    {category.classicoRate}% de tarifa
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Comprador paga juros no parcelamento
                  </div>
                </button>

                <button
                  type="button"
                  id="btn-listing-premium"
                  onClick={() => setListingType("premium")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    listingType === "premium"
                      ? "bg-[#af52de]/15 border-[#af52de]/50 text-white ring-1 ring-[#af52de]/40"
                      : "bg-black/40 border-white/[0.06] text-neutral-400 hover:border-white/[0.12]"
                  }`}
                >
                  <div className="font-semibold text-xs text-white">Premium</div>
                  <div className="text-[11px] text-[#d884ff] font-medium mt-0.5">
                    {category.premiumRate}% de tarifa
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Até 10x ou 12x SEM juros para o cliente
                  </div>
                </button>
              </div>
            </div>

            {/* Price & Cost Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Preço de Venda (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">R$</span>
                  <input
                    type="number"
                    id="input-calc-price"
                    step="0.10"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#af52de] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Custo Unitário (CMV) (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-mono">R$</span>
                  <input
                    type="number"
                    id="input-calc-cost"
                    step="0.10"
                    value={productCost}
                    onChange={(e) => setProductCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#af52de] transition"
                  />
                </div>
              </div>
            </div>

            {/* Reputation / Frete Discount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300 flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5 text-[#bf5af2]" />
                  <span>Reputação (Desconto no Frete Mercado Envios)</span>
                </label>
              </div>
              <select
                id="select-reputation"
                value={reputationDiscount}
                onChange={(e) => setReputationDiscount(parseFloat(e.target.value))}
                className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#af52de] transition"
              >
                {ML_RULES.reputationDiscounts.map((rep, i) => (
                  <option key={i} value={rep.discount}>
                    {rep.label} ({rep.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Tax & Operational Costs */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-white/[0.06]">
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                  Imposto (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="input-calc-tax"
                    step="0.5"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <span className="absolute right-2 top-2 text-[10px] text-neutral-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                  Embalagem (R$)
                </label>
                <input
                  type="number"
                  id="input-calc-packaging"
                  step="0.5"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/50 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-neutral-400 mb-1">
                  Outros Custos
                </label>
                <input
                  type="number"
                  id="input-calc-extra"
                  step="0.5"
                  value={extraCost}
                  onChange={(e) => setExtraCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/50 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Rule Indicator Notice */}
            <div
              className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 ${
                current.isUnder79
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}
            >
              {current.isUnder79 ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Regra de Produtos &lt; R$ 79,00:</strong>
                    O Mercado Livre cobra taxa fixa de <strong>R$ 6,00</strong> por unidade vendida. O comprador paga o frete.
                  </div>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block">Regra de Produtos &ge; R$ 79,00:</strong>
                    Frete Grátis Mercado Envios obrigatório. O vendedor paga aproximadamente{" "}
                    <strong>R$ {current.sellerShipping.toFixed(2)}</strong> com seu desconto de reputação. Sem taxa fixa de R$ 6.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reverse Target Price Box */}
          <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-semibold text-white tracking-tight flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#bf5af2]" />
              <span>Calculadora Reversa de Preço Alvo</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Defina a margem ou lucro que você quer colocar no bolso, e nós dizemos exatamente quanto cobrar no Mercado Livre:
            </p>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  setTargetMode("margin");
                  setTargetValue(20);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  targetMode === "margin"
                    ? "bg-[#af52de] text-white shadow-sm"
                    : "bg-black/40 text-neutral-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                Margem Alvo (%)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTargetMode("profit");
                  setTargetValue(30);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  targetMode === "profit"
                    ? "bg-[#af52de] text-white shadow-sm"
                    : "bg-black/40 text-neutral-400 hover:text-white border border-white/[0.06]"
                }`}
              >
                Lucro Fixo (R$)
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-1/2">
                <label className="block text-[10px] text-neutral-400 mb-1">
                  {targetMode === "margin" ? "Margem Líquida Desejada" : "Lucro Líquido Desejado"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#af52de]"
                  />
                  <span className="absolute right-3 top-2 text-xs text-neutral-400">
                    {targetMode === "margin" ? "%" : "R$"}
                  </span>
                </div>
              </div>

              <div className="w-1/2 bg-black/50 border border-white/[0.06] rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-neutral-400 block">Preço de Venda Sugerido:</span>
                <span className="text-sm font-bold text-[#d884ff] font-mono">
                  R$ {calculatedTargetPrice > 0 ? calculatedTargetPrice.toFixed(2) : "0.00"}
                </span>
                <button
                  type="button"
                  onClick={() => setSalePrice(parseFloat(calculatedTargetPrice.toFixed(2)))}
                  className="mt-1 block mx-auto text-[10px] text-[#bf5af2] hover:text-[#d884ff] underline cursor-pointer"
                >
                  Aplicar este preço
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Profit Card */}
          <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div>
                <span className="text-xs font-medium text-neutral-400 block">
                  Resultado Líquido por Venda
                </span>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span
                    className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${
                      current.netProfit >= 0 ? "text-emerald-400" : "text-rose-500"
                    }`}
                  >
                    R$ {current.netProfit.toFixed(2)}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      current.netMargin >= 15
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : current.netMargin > 0
                        ? "bg-[#af52de]/20 text-[#d884ff] border border-[#af52de]/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {current.netMargin.toFixed(1)}% margem
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-white/[0.06]">
                <span className="text-xs text-neutral-400">Ponto de Equilíbrio (0% lucro):</span>
                <span className="text-xs font-bold text-[#d884ff] font-mono">
                  R$ {breakevenPrice > 0 ? breakevenPrice.toFixed(2) : "0.00"}
                </span>
              </div>
            </div>

            {/* DRE Breakdown List */}
            <div className="py-5 space-y-3">
              <h4 className="text-xs font-semibold text-neutral-300 tracking-tight">
                Extrato Detalhado da Venda (DRE Mercado Livre)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 px-3 bg-black/40 border border-white/[0.06] rounded-xl font-medium">
                  <span className="text-white">(+) Preço de Venda Bruto</span>
                  <span className="text-white font-mono font-bold">R$ {current.price.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#bf5af2]"></span>
                    <span>(-) Tarifa ML ({listingType.toUpperCase()} {commissionRate}%)</span>
                  </span>
                  <span className="text-rose-400 font-mono">- R$ {current.commissionVal.toFixed(2)}</span>
                </div>

                {current.isUnder79 && (
                  <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>(-) Taxa Fixa ML (Produto &lt; R$ 79)</span>
                    </span>
                    <span className="text-rose-400 font-mono">- R$ {current.fixedFee.toFixed(2)}</span>
                  </div>
                )}

                {!current.isUnder79 && (
                  <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>(-) Frete Mercado Envios (Vendedor)</span>
                    </span>
                    <span className="text-rose-400 font-mono">- R$ {current.sellerShipping.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d884ff]"></span>
                    <span>(-) Imposto sobre NF ({taxRate}%)</span>
                  </span>
                  <span className="text-rose-400 font-mono">- R$ {current.taxVal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                    <span>(-) Custo do Produto (CMV)</span>
                  </span>
                  <span className="text-rose-400 font-mono">- R$ {productCost.toFixed(2)}</span>
                </div>

                {(packagingCost > 0 || extraCost > 0) && (
                  <div className="flex justify-between items-center py-1 px-3 text-neutral-400">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
                      <span>(-) Embalagem e Outros Custos</span>
                    </span>
                    <span className="text-rose-400 font-mono">
                      - R$ {(packagingCost + extraCost).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 px-3 bg-black/50 border border-white/[0.08] rounded-xl text-xs font-semibold">
                  <span className="text-white">(=) Lucro Líquido Real</span>
                  <span
                    className={`font-mono ${
                      current.netProfit >= 0 ? "text-emerald-400" : "text-rose-500"
                    }`}
                  >
                    R$ {current.netProfit.toFixed(2)} ({current.netMargin.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Total Fees Paid to Mercado Livre */}
            <div className="p-3 bg-[#af52de]/10 border border-[#af52de]/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Total deixado no Mercado Livre (Comissão + Frete/Taxa):</span>
              <span className="font-bold text-[#d884ff] font-mono text-xs">
                R$ {current.totalMlCost.toFixed(2)} (
                {((current.totalMlCost / (current.price || 1)) * 100).toFixed(1)}% do preço)
              </span>
            </div>
          </div>

          {/* Side-by-Side Comparison: Clássico vs Premium */}
          <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-semibold text-white flex items-center space-x-2 tracking-tight">
              <Layers className="w-4 h-4 text-[#bf5af2]" />
              <span>Comparativo Lado a Lado: Clássico vs Premium</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Clássico Box */}
              <div
                className={`p-4 rounded-xl border transition ${
                  listingType === "classico"
                    ? "bg-[#af52de]/10 border-[#af52de]/40 ring-1 ring-[#af52de]/30"
                    : "bg-black/40 border-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">Anúncio Clássico</span>
                  <span className="text-[10px] font-medium text-neutral-400 bg-black/40 px-2 py-0.5 rounded border border-white/[0.06]">
                    Tarifa {category.classicoRate}%
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-emerald-400 mb-1">
                  R$ {compClassico.netProfit.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-400">
                  Margem: <span className="text-white font-medium">{compClassico.netMargin.toFixed(1)}%</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Melhor para produtos com preço altamente competitivo ou tíquetes baixos onde o cliente costuma pagar à vista (Pix/Boleto).
                </p>
              </div>

              {/* Premium Box */}
              <div
                className={`p-4 rounded-xl border transition ${
                  listingType === "premium"
                    ? "bg-[#af52de]/10 border-[#af52de]/40 ring-1 ring-[#af52de]/30"
                    : "bg-black/40 border-white/[0.06]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">Anúncio Premium</span>
                  <span className="text-[10px] font-medium text-[#d884ff] bg-[#af52de]/15 px-2 py-0.5 rounded border border-[#af52de]/30">
                    Tarifa {category.premiumRate}%
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-emerald-400 mb-1">
                  R$ {compPremium.netProfit.toFixed(2)}
                </div>
                <div className="text-xs text-neutral-400">
                  Margem: <span className="text-white font-medium">{compPremium.netMargin.toFixed(1)}%</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Oferece até 10x ou 12x SEM juros. Converte até 3x mais em produtos acima de R$ 100,00 onde o brasileiro prefere parcelar.
                </p>
              </div>
            </div>

            <div className="p-3 bg-black/40 border border-white/[0.06] rounded-xl text-xs text-neutral-300 leading-relaxed">
              💡 <strong>Diferença Líquida:</strong> No Clássico você ganha{" "}
              <strong className="text-emerald-400">
                R$ {Math.abs(compClassico.netProfit - compPremium.netProfit).toFixed(2)} a mais por unidade
              </strong>
              , porém o Premium gera mais visitas e maior taxa de conversão devido ao parcelamento sem juros grátis para o comprador.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
