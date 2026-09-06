import React from "react";
import { 
  Camera, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon, 
  ZoomIn, 
  Maximize2, 
  ShieldAlert, 
  Sparkles,
  Layers,
  HelpCircle
} from "lucide-react";

export const PhotoGuide: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Foto Principal (Fundo Branco Puro)",
      badge: "Obrigatória para Catálogo",
      description:
        "Fundo 100% branco digital (RGB 255, 255, 255). Sem sombras pretas pesadas, sem marca d'água, sem texto, sem bordas coloridas. O produto deve ocupar de 70% a 85% do quadro.",
      tips: ["Formato quadrado 1200x1200px", "Iluminação uniforme sem reflexos estourados", "Centralizado"],
    },
    {
      number: "02",
      title: "Ângulos Laterais & Traseiros",
      badge: "Detalhes Técnicos",
      description:
        "Mostre o produto de perfil e de costas. Mostre conexões, entradas (USB, cabos), botões e acabamento dos materiais.",
      tips: ["Gera confiança imediata", "Elimina dúvidas de conectividade e botões"],
    },
    {
      number: "03",
      title: "Foto em Uso / Contexto (Lifestyle)",
      badge: "Escala & Percepção",
      description:
        "O produto sendo manuseado ou ambientado no espaço onde será utilizado. Ajuda o cérebro do comprador a ter noção imediata de proporção e tamanho real.",
      tips: ["Mostre em uma mesa ou na mão", "Ambiente limpo e bem iluminado"],
    },
    {
      number: "04",
      title: "Medidas & Dimensões com Cotas",
      badge: "Reduz 60% das Devoluções",
      description:
        "Foto com infográfico mostrando largura, altura, profundidade e peso em centímetros (cm) e gramas (g).",
      tips: ["Evita que o comprador devolva por achar 'pequeno demais'", "Fundamental para móveis e utilidades"],
    },
    {
      number: "05",
      title: "Itens Inclusos na Embalagem",
      badge: "O que vem na caixa",
      description:
        "Foto de tudo o que o cliente vai receber quando abrir o pacote: manual, cabos, fontes, baterias, acessórios e a caixa original.",
      tips: ["Reduz perguntas no campo de dúvidas", "Protege você contra reclamações indevidas"],
    },
    {
      number: "06",
      title: "Infográfico de Principais Benefícios",
      badge: "Conversão Máxima",
      description:
        "Destaque os 3 a 4 maiores diferenciais do seu produto (ex: Bateria de 40h, Resistente à água IPX7, Cabo reforçado em nylon).",
      tips: ["Ideal para quem compra pelo celular e não lê a descrição completa"],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Padrão Oficial de Fotografia Mercado Livre</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Guia de Fotos para Catálogo & Primeira Página
          </h2>
          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Mais de 70% das decisões de compra no Mercado Livre acontecem puramente pelas fotos. Siga este roteiro de 6 fotos para ativar o zoom e não ser desqualificado pelo catálogo.
          </p>
        </div>
      </div>

      {/* Technical Requirements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-3">
            <ZoomIn className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Resolução para Zoom</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Mínimo de <strong>1200 x 1200 pixels</strong> (proporção 1:1 quadrada). Menos que isso não ativa a lupa de zoom no desktop nem alta nitidez no app.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-3">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Fundo Branco Puro</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            A 1ª foto precisa ter <strong>fundo digital RGB (255, 255, 255)</strong>. Fundos cinza, com sombras duras ou recorte mal feito são rebaixados pelo algoritmo.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-3">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Sem Marca d'Água</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            É terminantemente proibido colocar telefone, logotipo da loja, selos promocionais ("Frete Grátis") ou bordas na 1ª foto.
          </p>
        </div>
      </div>

      {/* 6 Step Photo Breakdown */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>A Sequência Perfeita de 6 Fotos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-neutral-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded">
                    {step.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">{step.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{step.description}</p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 space-y-1">
                {step.tips.map((tip, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-[11px] text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>O Que o Mercado Livre Recomenda:</span>
          </h4>
          <ul className="text-xs text-neutral-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Primeira foto isolada no fundo branco puro (PNG ou JPEG de alta qualidade).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>O produto deve ocupar a maior parte da imagem (cerca de 80%).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Adicionar fotos com medidas exatas para evitar devoluções por tamanho.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Fotografar a embalagem e acessórios exatamente como o cliente receberá.</span>
            </li>
          </ul>
        </div>

        <div className="bg-neutral-900 border border-rose-500/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-rose-400 flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>O Que É Proibido e Penalizado:</span>
          </h4>
          <ul className="text-xs text-neutral-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Marca d'água, telefone, WhatsApp ou link para Instagram/site próprio.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Bordas coloridas, molduras ou selos como "Envio Rápido", "Original" ou "Promoção".</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Fotos pixeladas ou com resolução inferior a 500x500 pixels.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Colocar foto da embalagem fechada como primeira foto principal.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
