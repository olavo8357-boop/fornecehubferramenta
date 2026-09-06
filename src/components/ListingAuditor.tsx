import React, { useState } from "react";
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight,
  Camera,
  Layers,
  Tag,
  DollarSign
} from "lucide-react";
import { AuditResult } from "../types";

export const ListingAuditor: React.FC = () => {
  const [title, setTitle] = useState("Teclado Mecânico Gamer RGB Redragon Kumara K552 Switch Blue ABNT2");
  const [price, setPrice] = useState(189.90);
  const [description, setDescription] = useState("Teclado gamer mecânico com iluminação RGB, switch blue removível, padrão ABNT2 com Ç. Acompanha extrator de teclas e manual. Garantia de 6 meses com nota fiscal.");
  const [hasWhiteBackgroundPhoto, setHasWhiteBackgroundPhoto] = useState(true);
  const [photosCount, setPhotosCount] = useState(5);
  const [hasAttributesFilled, setHasAttributesFilled] = useState(true);
  const [listingType, setListingType] = useState<"classico" | "premium">("premium");

  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ml/audit-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          price,
          description,
          hasWhiteBackgroundPhoto,
          photosCount,
          hasAttributesFilled,
          listingType,
        }),
      });

      if (!res.ok) throw new Error("Erro na auditoria.");
      const data = await res.json();
      if (data.success) {
        setAuditResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Qualidade & Termômetro Meli</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Auditor de Saúde do Anúncio
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Analise se o seu anúncio cumpre todos os requisitos do algoritmo do Mercado Livre para conquistar o topo das buscas e ser elegível ao catálogo.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Audit Form (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Dados do Anúncio a Analisar</span>
              <span className="text-xs text-neutral-400">Checklist oficial</span>
            </h3>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-neutral-300">
                  Título Atual
                </label>
                <span className={`text-[11px] font-bold ${title.length > 60 ? "text-rose-400" : "text-neutral-400"}`}>
                  {title.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                id="audit-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Preço de Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                id="audit-price-input"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Photos Check */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Fotos do Anúncio</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Quantidade de Fotos</label>
                  <select
                    value={photosCount}
                    onChange={(e) => setPhotosCount(parseInt(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value={1}>1 foto (Muito pouco)</option>
                    <option value={2}>2 fotos</option>
                    <option value={3}>3 fotos</option>
                    <option value={4}>4 fotos</option>
                    <option value={5}>5 fotos</option>
                    <option value={6}>6 fotos ou mais (Ideal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Primeira Foto Fundo Branco</label>
                  <select
                    value={hasWhiteBackgroundPhoto ? "yes" : "no"}
                    onChange={(e) => setHasWhiteBackgroundPhoto(e.target.value === "yes")}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white"
                  >
                    <option value="yes">Sim (100% branco)</option>
                    <option value="no">Não / Com cenário</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attributes & Listing Type */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAttributesFilled}
                  onChange={(e) => setHasAttributesFilled(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-400 focus:ring-0"
                />
                <span>Ficha Técnica preenchida (Marca, Modelo, EAN/Código de barras)</span>
              </label>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Tipo de Anúncio</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setListingType("classico")}
                    className={`py-1.5 px-3 text-xs rounded-lg border transition ${
                      listingType === "classico" ? "bg-amber-400/20 border-amber-400 text-amber-300" : "bg-neutral-950 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    Clássico
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType("premium")}
                    className={`py-1.5 px-3 text-xs rounded-lg border transition ${
                      listingType === "premium" ? "bg-amber-400/20 border-amber-400 text-amber-300" : "bg-neutral-950 border-neutral-800 text-neutral-400"
                    }`}
                  >
                    Premium (Sem Juros)
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-run-audit"
              onClick={handleRunAudit}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditando anúncio...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Executar Auditoria de Qualidade</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {!auditResult && !loading && (
            <div className="bg-neutral-900/60 border border-dashed border-neutral-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Descubra por que seu anúncio não está vendendo
              </h3>
              <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                Clique em <strong>"Executar Auditoria de Qualidade"</strong> para analisar título, fotos, ficha técnica e precificação com base nos fatores de ranqueamento oficiais do Mercado Livre.
              </p>
              <button
                type="button"
                onClick={handleRunAudit}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition border border-neutral-700 cursor-pointer"
              >
                Auditar anúncio de exemplo
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 animate-pulse flex items-center justify-center text-amber-400">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-white">Analisando conformidade com as diretrizes do ML...</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                Verificando limite de 60 caracteres, palavras proibidas, elegibilidade para catálogo e qualidade de fotos.
              </p>
            </div>
          )}

          {auditResult && (
            <div className="space-y-6">
              {/* Score Header */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                    Índice de Qualidade do Anúncio (ML Health Score)
                  </span>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span
                      className={`text-4xl sm:text-5xl font-black font-mono ${
                        auditResult.score >= 80
                          ? "text-emerald-400"
                          : auditResult.score >= 60
                          ? "text-amber-400"
                          : "text-rose-500"
                      }`}
                    >
                      {auditResult.score}/100
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                        auditResult.score >= 80
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : auditResult.score >= 60
                          ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {auditResult.tier}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                  {auditResult.score >= 85
                    ? "Seu anúncio tem altíssima relevância e pontuação máxima para o algoritmo do Mercado Livre recomendar no topo."
                    : "Existem pontos que estão reduzindo o alcance do anúncio ou impedindo a entrada no catálogo oficial."}
                </div>
              </div>

              {/* Issues / Checklist */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Diagnóstico e Ações Recomendadas
                </h4>

                <div className="space-y-3">
                  {auditResult.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-start space-x-3 text-xs ${
                        issue.type === "critical"
                          ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                          : issue.type === "warning"
                          ? "bg-amber-400/10 border-amber-400/30 text-amber-200"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      }`}
                    >
                      {issue.type === "critical" ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : issue.type === "warning" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-1">
                        <div className="font-semibold">{issue.text}</div>
                        <div className="text-neutral-300 font-sans">
                          👉 <strong>O que fazer:</strong> {issue.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
