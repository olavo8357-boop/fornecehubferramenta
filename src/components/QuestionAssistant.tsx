import React, { useState } from "react";
import { 
  MessageSquareText, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Zap, 
  Clock, 
  ShieldCheck, 
  FileText,
  Truck,
  RefreshCw
} from "lucide-react";
import { QuestionAnswerData } from "../types";

export const QuestionAssistant: React.FC = () => {
  const [question, setQuestion] = useState("Tem a pronta entrega e consegue enviar ainda hoje?");
  const [productContext, setProductContext] = useState("Teclado Mecânico Gamer RGB Redragon Kumara Switch Blue ABNT2");
  const [deliveryType, setDeliveryType] = useState<"full" | "flex" | "envios">("full");
  const [hasInvoice, setHasInvoice] = useState(true);
  const [hasWarranty, setHasWarranty] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuestionAnswerData | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const frequentQuestions = [
    "Tem a pronta entrega e consegue enviar ainda hoje?",
    "Emite Nota Fiscal para CNPJ ou CPF?",
    "É original de fábrica e vem lacrado na caixa?",
    "Serve/é compatível com meu modelo?",
    "Vocês enviam pelo Mercado Livre Full?",
    "Tem na cor preta com garantia?",
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handleGenerate = async (qText?: string) => {
    const textToUse = qText !== undefined ? qText : question;
    if (!textToUse.trim()) {
      setError("Por favor, digite a pergunta do comprador.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ml/answer-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToUse,
          productContext,
          deliveryType,
          hasInvoice,
          hasWarranty,
        }),
      });

      if (!res.ok) throw new Error("Falha ao gerar respostas.");
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        throw new Error("Resposta inválida da API.");
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
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
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>SAC & Pré-Venda Mercado Livre</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Gerador de Respostas Pré-Venda com IA
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Responda às perguntas dos compradores em segundos com 3 abordagens estratégicas. Aumente sua conversão respeitando 100% das regras de comunicação do Mercado Livre.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Dúvida do Comprador</span>
              <span className="text-xs text-neutral-400">Pré-venda ML</span>
            </h3>

            {/* Frequent Presets */}
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                Dúvidas mais comuns no Mercado Livre:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {frequentQuestions.map((fq, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuestion(fq);
                      handleGenerate(fq);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 rounded-lg transition text-left cursor-pointer"
                  >
                    {fq}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Textarea */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Pergunta feita no anúncio
              </label>
              <textarea
                id="input-sac-question"
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Cole aqui a pergunta que o cliente fez no seu anúncio..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            {/* Product Context */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Contexto do Produto
              </label>
              <input
                type="text"
                id="input-sac-context"
                value={productContext}
                onChange={(e) => setProductContext(e.target.value)}
                placeholder="Ex: Teclado Mecânico Gamer RGB Redragon Kumara"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Shipping Mode */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Modalidade de Envio
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryType("full")}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    deliveryType === "full"
                      ? "bg-amber-400/10 border-amber-400 text-amber-300 font-bold"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div className="text-xs">⚡ Mercado Full</div>
                  <div className="text-[10px] text-neutral-400">Entrega ultra-rápida</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType("flex")}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    deliveryType === "flex"
                      ? "bg-amber-400/10 border-amber-400 text-amber-300 font-bold"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div className="text-xs">🚀 Envios Flex</div>
                  <div className="text-[10px] text-neutral-400">Chega hoje</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType("envios")}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    deliveryType === "envios"
                      ? "bg-amber-400/10 border-amber-400 text-amber-300 font-bold"
                      : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <div className="text-xs">📦 Normal / Correios</div>
                  <div className="text-[10px] text-neutral-400">Postagem em 24h</div>
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInvoice}
                  onChange={(e) => setHasInvoice(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-400 focus:ring-0"
                />
                <span>Emite Nota Fiscal (CPF/CNPJ)</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasWarranty}
                  onChange={(e) => setHasWarranty(e.target.checked)}
                  className="rounded border-neutral-700 text-amber-400 focus:ring-0"
                />
                <span>Garantia Assegurada</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            <button
              type="button"
              id="btn-generate-answers"
              onClick={() => handleGenerate()}
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
                  <span>Gerando 3 opções de resposta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  <span>Gerar Respostas Estratégicas</span>
                </>
              )}
            </button>
          </div>

          {/* Mercado Livre Policy Warning */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Regras Críticas do Mercado Livre para SAC:</span>
            </h4>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>
                <strong className="text-neutral-200">Nunca informe contatos externos:</strong> Telefone, WhatsApp, e-mail, Instagram ou links externos causam exclusão da resposta e suspensão da conta.
              </li>
              <li>
                <strong className="text-neutral-200">Velocidade é chave:</strong> O algoritmo do Mercado Livre premia anúncios de vendedores que respondem em menos de 10 minutos.
              </li>
              <li>
                <strong className="text-neutral-200">Encerre com chamada para ação:</strong> Convide o cliente a fechar o pedido enquanto há estoque.
              </li>
            </ul>
          </div>
        </div>

        {/* Results Column (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-neutral-900/60 border border-dashed border-neutral-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                <MessageSquareText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Aumente a conversão das suas perguntas
              </h3>
              <p className="text-sm text-neutral-400 max-w-md mb-6 leading-relaxed">
                Clique no botão <strong>"Gerar Respostas Estratégicas"</strong> para ver 3 respostas prontas (Cortês, Técnica e Urgência) personalizadas para o seu produto.
              </p>
              <button
                type="button"
                onClick={() => handleGenerate()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition border border-neutral-700 cursor-pointer"
              >
                Gerar com pergunta de exemplo
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 animate-pulse flex items-center justify-center text-amber-400">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-white">Criando respostas persuasivas...</h4>
              <p className="text-xs text-neutral-400 max-w-sm">
                Adaptando linguagem para o perfil de compradores do Mercado Livre Brasil, sem dados de contato proibidos e com foco em fechamento.
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Conversion Tip Banner */}
              {result.conversionTip && (
                <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4 flex items-start space-x-3">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-300 block">Dica de Conversão Imediata:</span>
                    <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                      {result.conversionTip}
                    </p>
                  </div>
                </div>
              )}

              {/* 3 Answer Options */}
              {result.options.map((opt, idx) => {
                const isCopied = copiedIdx === idx;
                return (
                  <div
                    key={idx}
                    id={`answer-card-${idx}`}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-neutral-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white px-2.5 py-0.5 rounded-full bg-neutral-800 border border-neutral-700">
                          Opção {idx + 1}: {opt.tone}
                        </span>
                        <span className="text-xs text-neutral-400 hidden sm:inline">
                          — {opt.explanation}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(opt.text, idx)}
                        id={`btn-copy-answer-${idx}`}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg transition shrink-0 cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-neutral-950" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Resposta</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap selection:bg-amber-400 selection:text-neutral-950">
                      {opt.text}
                    </div>

                    <p className="text-[11px] text-neutral-500 sm:hidden">
                      {opt.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
