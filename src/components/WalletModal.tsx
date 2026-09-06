import React, { useState } from "react";
import { 
  X, 
  Wallet, 
  Plus, 
  QrCode, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck,
  Zap,
  Sparkles
} from "lucide-react";
import { WalletTransaction } from "../types";
import { formatCurrency } from "../utils";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  transactions: WalletTransaction[];
  onAddFunds: (amount: number, method: "PIX" | "Cartão") => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  transactions,
  onAddFunds
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"pix" | "cartao" | "historico">("pix");
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136fornecehub-financeiro-pix-key-8912735204000053039865802BR5915FORNECEHUB LTDA6009SAO PAULO62070503***6304E8A2");
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleConfirmDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDepositSuccess(true);
      onAddFunds(depositAmount, activeTab === "pix" ? "PIX" : "Cartão");
      setTimeout(() => {
        setDepositSuccess(false);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div 
        id="modal-wallet-container"
        className="bg-[#121216]/95 border border-white/[0.12] rounded-3xl w-full max-w-xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-150 backdrop-blur-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#af52de]/15 text-[#d884ff] border border-[#af52de]/30 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#bf5af2]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-tight">Carteira Digital ForneceHub</h2>
              <p className="text-[11px] text-[#86868b]">Saldo para faturamento de pedidos e taxas de envio</p>
            </div>
          </div>
          <button
            id="close-wallet-modal-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Highlight Banner */}
        <div className="p-6 bg-black/40 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Saldo Disponível em Conta</span>
            <span className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
              {formatCurrency(balance)}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#af52de]/15 border border-[#af52de]/30 text-[#d884ff] text-xs font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#bf5af2]" /> Seguro & Instantâneo
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.08] bg-black/20 px-6 text-xs">
          <button
            onClick={() => setActiveTab("pix")}
            className={`py-3 px-4 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "pix"
                ? "border-[#af52de] text-[#d884ff]"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <QrCode className="w-4 h-4" /> Recarga Instantânea via PIX
          </button>

          <button
            onClick={() => setActiveTab("cartao")}
            className={`py-3 px-4 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "cartao"
                ? "border-[#af52de] text-[#d884ff]"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Cartão de Crédito
          </button>

          <button
            onClick={() => setActiveTab("historico")}
            className={`py-3 px-4 font-medium border-b-2 transition flex items-center gap-2 ${
              activeTab === "historico"
                ? "border-[#af52de] text-[#d884ff]"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Clock className="w-4 h-4" /> Extrato
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {activeTab === "pix" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-2">
                  1. Selecione ou digite o valor da recarga:
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                        depositAmount === amt
                          ? "bg-[#af52de] text-white shadow-sm"
                          : "bg-black/40 border border-white/[0.08] text-neutral-300 hover:bg-white/[0.06]"
                      }`}
                    >
                      + R$ {amt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-xs font-mono">R$</span>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/60 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-[#af52de]"
                  />
                </div>
              </div>

              {/* PIX Mock QR and Key */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=fornecehub-pix-recarga"
                    alt="QR Code PIX ForneceHub"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <span className="text-xs font-semibold text-white block tracking-tight">Chave Pix Copia e Cola</span>
                  <p className="text-[10px] text-neutral-400 font-mono break-all line-clamp-2 bg-black/60 p-2 rounded-xl border border-white/[0.06]">
                    00020126580014br.gov.bcb.pix0136fornecehub-financeiro-pix-key-8912735204000053039865802BR5915FORNECEHUB LTDA6009SAO PAULO62070503***6304E8A2
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3 py-1.5 bg-[#af52de]/15 hover:bg-[#af52de]/25 text-[#d884ff] rounded-xl text-xs font-medium transition inline-flex items-center gap-1.5 border border-[#af52de]/30"
                  >
                    {copiedPix ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPix ? "Código Pix Copiado!" : "Copiar Chave Pix"}
                  </button>
                </div>
              </div>

              <button
                id="btn-simulate-pix-deposit"
                type="button"
                onClick={handleConfirmDeposit}
                disabled={isProcessing || depositSuccess || depositAmount <= 0}
                className="w-full py-2.5 bg-[#af52de] hover:bg-[#bf5af2] text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-2 shadow-[0_2px_14px_rgba(175,82,222,0.35)] active:scale-95 disabled:opacity-50"
              >
                {depositSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Recarga Confirmada no ForneceHub!
                  </>
                ) : isProcessing ? (
                  "Verificando recebimento Pix..."
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Confirmar Pagamento Pix (R$ {depositAmount.toFixed(2)})
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "cartao" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Número do Cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#af52de]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#af52de]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#af52de]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmDeposit}
                disabled={isProcessing || depositSuccess}
                className="w-full py-2.5 bg-[#af52de] hover:bg-[#bf5af2] text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-2 shadow-[0_2px_14px_rgba(175,82,222,0.35)]"
              >
                {depositSuccess ? "Recarga Aprovada!" : "Recarregar R$ 100,00 no Cartão"}
              </button>
            </div>
          )}

          {activeTab === "historico" && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {transactions.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-6">Nenhuma movimentação recente na carteira.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-black/40 rounded-xl border border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-white">{tx.title}</p>
                      <p className="text-[10px] text-neutral-400">{tx.date} • {tx.paymentMethod}</p>
                    </div>
                    <span className={`font-mono font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type === "credit" ? "+" : "-"} R$ {tx.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
