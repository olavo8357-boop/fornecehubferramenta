import React, { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Save, 
  Download, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Lightbulb, 
  Camera,
  RefreshCw
} from "lucide-react";
import { ML_CATEGORIES } from "../data/mlCategories";
import { ListingFormData, OptimizedListingData, SavedListing } from "../types";

interface ListingOptimizerProps {
  onSaveListing: (listing: SavedListing) => void;
}

export const ListingOptimizer: React.FC<ListingOptimizerProps> = ({ onSaveListing }) => {
  const [formData, setFormData] = useState<ListingFormData>({
    productName: "Teclado Mecânico Gamer RGB Switch Blue",
    brand: "Redragon",
    model: "Kumara K552",
    category: "Informática e Acessórios",
    keyFeatures: "Layout ABNT2, iluminação RGB com 18 modos, teclas 100% anti-ghosting, cabo reforçado, switch removível",
    price: 189.90,
    condition: "new",
    warrantyMonths: 6,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizedListingData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual title tester state
  const [customTitle, setCustomTitle] = useState("");

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.productName.trim()) {
      setError("Por favor, preencha o nome do produto.");
      return;
    }

    setLoading(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const response = await fetch("/api/ml/optimize-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Falha ao otimizar anúncio.");
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        setSelectedTitleIdx(0);
        if (resData.data.titles?.[0]) {
          setCustomTitle(resData.data.titles[0].title);
        }
      } else {
        throw new Error("Dados de resposta inválidos.");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao gerar otimização.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const activeTitle = result.titles[selectedTitleIdx]?.title || result.titles[0]?.title || formData.productName;
    const newSaved: SavedListing = {
      id: "ml-" + Date.now(),
      createdAt: new Date().toLocaleDateString("pt-BR"),
      productName: formData.productName,
      brand: formData.brand,
      price: formData.price,
      selectedTitle: activeTitle,
      data: result,
    };
    onSaveListing(newSaved);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportTxt = () => {
    if (!result) return;
    const activeTitle = result.titles[selectedTitleIdx]?.title || result.titles[0]?.title;
    const content = `ANÚNCIO OTIMIZADO MERCADO LIVRE
=============================================
TÍTULO PRINCIPAL (60 chars máx):
${activeTitle}

OUTRAS OPÇÕES DE TÍTULO:
${result.titles.map((t, i) => `${i + 1}. [${t.charCount}/60] ${t.title} (${t.strategy})`).join("\n")}

CATEGORIA RECOMENDADA:
${result.suggestedCategory}

TERMOS MAIS BUSCADOS (TAGS):
${result.keywords.join(", ")}

FICHA TÉCNICA:
${result.technicalAttributes.map((a) => `- ${a.name}: ${a.value}`).join("\n")}

DESCRIÇÃO COMPLETA:
${result.technicalDescription}

ROTEIRO DE FOTOS RECOMENDADO:
${result.photoGuide.map((p, i) => `${i + 1}. ${p}`).join("\n")}

DICAS DO ALGORITMO:
${result.sellerTips.join("\n")}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anuncio-ml-${formData.productName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const testTitleLength = customTitle.length;

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algoritmo Meli Ranker 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Criador & Otimizador de Anúncios ML
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Gere títulos de até <span className="text-amber-400 font-semibold">60 caracteres</span> que o algoritmo do Mercado Livre prioriza, ficha técnica completa para ranquear no catálogo e descrição profissional sem HTML.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
              <span>Dados do Produto</span>
              <span className="text-xs font-normal text-neutral-400">Campos do anúncio</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nome do Produto <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-product-name"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Ex: Teclado Mecânico Gamer RGB"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Marca
                  </label>
                  <input
                    type="text"
                    id="input-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ex: Redragon"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Modelo / Código
                  </label>
                  <input
                    type="text"
                    id="input-model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Ex: Kumara K552"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Categoria Principal no ML
                </label>
                <select
                  id="select-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                >
                  {ML_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    id="input-price"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Condição
                  </label>
                  <select
                    id="select-condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as "new" | "used" })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  >
                    <option value="new">Novo</option>
                    <option value="used">Usado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Garantia
                  </label>
                  <select
                    id="select-warranty"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: parseInt(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  >
                    <option value="1">1 mês</option>
                    <option value="3">3 meses</option>
                    <option value="6">6 meses</option>
                    <option value="12">12 meses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Especificações Chave e Diferenciais
                </label>
                <textarea
                  id="textarea-features"
                  rows={3}
                  value={formData.keyFeatures}
                  onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                  placeholder="Ex: Cor preta, cabo USB-C banhado a ouro, switch outemu blue com clique audível, compatível com Windows e Mac"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-generate-listing"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                    <span>Otimizando para o Mercado Livre...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-neutral-950" />
                    <span>Gerar Anúncio Campeão</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Title Tester Simulator */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulador de Título (Regra 60 chars)</span>
              </h4>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  testTitleLength > 60
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : testTitleLength >= 50
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : testTitleLength >= 35
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {testTitleLength} / 60
              </span>
            </div>

            <input
              type="text"
              id="input-title-tester"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Digite para testar a contagem de caracteres..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
            />

            {/* Live Progress Bar */}
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  testTitleLength > 60
                    ? "bg-rose-500"
                    : testTitleLength >= 50
                    ? "bg-emerald-400"
                    : testTitleLength >= 35
                    ? "bg-amber-400"
                    : "bg-blue-400"
                }`}
                style={{ width: `${Math.min(100, (testTitleLength / 60) * 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-neutral-400 mt-2">
              {testTitleLength > 60 ? (
                <span className="text-rose-400 font-medium">
                  Atenção: O Mercado Livre corta títulos acima de 60 caracteres! Reduza {testTitleLength - 60} caracteres.
                </span>
              ) : testTitleLength >= 50 ? (
                <span className="text-emerald-400 font-medium">
                  Excelente! Tamanho ideal aproveitando as melhores palavras-chave.
                </span>
              ) : (
                "Estrutura padrão recomendada pelo ML: [Produto] + [Marca] + [Modelo] + [Característica]"
              )}
            </p>
          </div>
        </div>

        {/* Results Column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-neutral-900/60 border border-dashed border-neutral-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Pronto para ranquear no topo do Mercado Livre?
              </h3>
              <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                Preencha os dados do produto ao lado e clique em <strong>"Gerar Anúncio Campeão"</strong> para receber títulos calibrados em 60 caracteres, ficha técnica oficial e descrição técnica de alta conversão.
              </p>
              <button
                type="button"
                id="btn-trigger-sample"
                onClick={() => handleSubmit()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition border border-neutral-700 cursor-pointer"
              >
                Gerar com produto de exemplo
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 animate-pulse flex items-center justify-center text-amber-400">
                  <RefreshCw className="w-7 h-7 animate-spin" />
                </div>
              </div>
              <h4 className="text-base font-bold text-white">Analisando regras de algoritmo do Mercado Livre...</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                Calculando tamanho estrito de títulos (até 60 caracteres), montando Ficha Técnica obrigatória e gerando descrição sem HTML para o app móvel.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Action Bar (Save / Export / Copy All) */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400">Categoria sugerida:</span>
                  <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {result.suggestedCategory}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportTxt}
                    id="btn-export-txt"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition border border-neutral-700 cursor-pointer"
                    title="Baixar anúncio em arquivo .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar TXT</span>
                  </button>
                  <button
                    onClick={handleSave}
                    id="btn-save-listing"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Salvo!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Salvar Anúncio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1. Títulos Otimizados (60 Caracteres) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Títulos Otimizados (Máximo 60 Caracteres)</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Selecione uma das variações criadas seguindo a fórmula oficial do Mercado Livre
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {result.titles.map((titleObj, idx) => {
                    const isSelected = selectedTitleIdx === idx;
                    const isCopied = copiedKey === `title-${idx}`;
                    return (
                      <div
                        key={idx}
                        id={`title-card-${idx}`}
                        onClick={() => {
                          setSelectedTitleIdx(idx);
                          setCustomTitle(titleObj.title);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400/5 border-amber-400/40 ring-1 ring-amber-400/30"
                            : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1.5">
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-800 px-2 py-0.5 rounded">
                                {titleObj.strategy}
                              </span>
                              <span
                                className={`text-[11px] font-bold px-1.5 py-0.2 rounded ${
                                  titleObj.charCount <= 60
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {titleObj.charCount}/60 chars
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-white leading-snug">
                              {titleObj.title}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(titleObj.title, `title-${idx}`);
                            }}
                            id={`btn-copy-title-${idx}`}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition shrink-0 cursor-pointer"
                            title="Copiar título"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Ficha Técnica Oficial (Atributos Obrigatórios) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-amber-400" />
                      <span>Ficha Técnica do Catálogo Mercado Livre</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Preencher estes atributos aumenta sua pontuação de qualidade para 100%
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const text = result.technicalAttributes.map((a) => `${a.name}: ${a.value}`).join("\n");
                      handleCopy(text, "attributes");
                    }}
                    id="btn-copy-attributes"
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition border border-neutral-700 cursor-pointer"
                  >
                    {copiedKey === "attributes" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Ficha</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {result.technicalAttributes.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs"
                    >
                      <span className="text-neutral-400 font-medium">{attr.name}</span>
                      <span className="text-white font-semibold text-right">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Descrição Completa Sem HTML */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Descrição do Anúncio (Formato App Mercado Livre)</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Texto limpo sem HTML, perfeitamente legível na versão mobile do Mercado Livre
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(result.technicalDescription, "description")}
                    id="btn-copy-description"
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg transition cursor-pointer"
                  >
                    {copiedKey === "description" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-neutral-950" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Descrição</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap selection:bg-amber-400 selection:text-neutral-950">
                  {result.technicalDescription}
                </div>
              </div>

              {/* 4. Roteiro de Fotos & Termos de Busca */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Roteiro de Fotos */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Roteiro de 6 Fotos Obrigatórias</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {result.photoGuide.map((step, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Termos de Busca e Dicas */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center space-x-1.5 mb-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>Termos Mais Buscados no ML</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800">
                    <h5 className="text-[11px] font-bold text-amber-400 mb-1">Dica de Conversão Meli:</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {result.sellerTips[0] || "Responda às perguntas dos compradores em menos de 10 minutos para garantir o selo de alta resposta do Mercado Livre."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
