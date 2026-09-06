import React, { useState } from "react";
import { 
  X, 
  Send, 
  Sparkles, 
  Bot
} from "lucide-react";

export const HelpChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "Olá! Sou a IA de Atendimento ForneceHub. Como posso te ajudar a vender mais no Mercado Livre hoje?",
      time: "Agora"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Qual a taxa fixa abaixo de R$ 79?",
    "Como calcular o lucro real?",
    "Quantos caracteres deve ter o título?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/ml/ask-question-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          productContext: "Plataforma ForneceHub - Catálogo dropshipping e integração com Mercado Livre."
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botResponse = data.suggestedAnswers?.[0]?.text || 
          "Para vender com máxima relevância no Mercado Livre, utilize títulos de até 60 caracteres sem palavras promocionais, fotos de 1200x1200px com fundo 100% branco e calcule a taxa fixa de R$ 6,00 para itens abaixo de R$ 79,00.";

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botResponse,
            time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          }
        ]);
      } else {
        throw new Error("Failed");
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "No Mercado Livre: Anúncios Premium cobram 16% de comissão (12x sem juros). Anúncios Clássicos cobram 11%. Itens com preço inferior a R$ 79,00 possuem taxa adicional de R$ 6,00 por unidade.",
          time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          id="open-chat-widget-btn"
          onClick={() => setIsOpen(true)}
          className="h-13 px-4 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#9333ea] hover:from-[#4f46e5] hover:via-[#6d28d9] hover:to-[#7e22ce] text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center gap-2.5 transition-all duration-200 active:scale-95 group border border-purple-400/30"
          title="Ajuda e SAC IA"
        >
          <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-[10px] text-purple-200 block font-semibold leading-none">Precisa de Ajuda?</span>
            <span className="text-xs font-bold leading-tight">Suporte ForneceHub IA</span>
          </div>
        </button>
      ) : (
        <div 
          id="chat-widget-window"
          className="w-80 sm:w-96 bg-[#0a0715] border border-[#261d44] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Top Bar */}
          <div className="p-3.5 bg-[#0e0a1f] border-b border-[#201838] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Assistente ForneceHub IA</h4>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online 24/7
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-purple-900/20 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#0a0715]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-purple-600/20"
                      : "bg-[#120d26] border border-[#261d44] text-neutral-200 rounded-tl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 ${m.sender === "user" ? "text-purple-200 text-right" : "text-neutral-500"}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#120d26] border border-[#261d44] text-neutral-400 rounded-2xl rounded-tl-none p-2.5 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="p-2 bg-[#0e0a1f] border-t border-[#201838] flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-[#120d26] hover:bg-purple-950/40 text-purple-300 text-[10px] rounded-lg border border-[#261d44] transition flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-[#0a0715] border-t border-[#201838] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Digite sua dúvida sobre vendas..."
              className="flex-1 bg-[#120d26] border border-[#261d44] rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center transition disabled:opacity-40 shadow-sm shadow-purple-600/30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

