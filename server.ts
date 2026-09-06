import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to timeout AI calls if network is slow or blocked
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout esperando resposta da IA")), timeoutMs)
    ),
  ]);
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Otimizar Anúncio para Mercado Livre
app.post("/api/ml/optimize-listing", async (req, res) => {
  try {
    const {
      productName,
      brand = "",
      model = "",
      category = "",
      keyFeatures = "",
      price = 0,
      condition = "new",
      warrantyMonths = 3,
    } = req.body;

    if (!productName || typeof productName !== "string") {
      return res.status(400).json({ error: "Nome do produto é obrigatório." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é o maior especialista em SEO, algoritmo de busca e conversão de vendas do Mercado Livre (Brasil).
Crie uma otimização completa e profissional para o anúncio do seguinte produto:

Produto: ${productName}
Marca: ${brand || "Não informada"}
Modelo: ${model || "Não informado"}
Categoria: ${category || "Geral"}
Principais Características: ${keyFeatures || "Não especificadas"}
Preço estimado: R$ ${price}
Condição: ${condition === "new" ? "Novo" : "Usado"}
Garantia: ${warrantyMonths} meses

REGRAS CRÍTICAS DO MERCADO LIVRE:
1. Títulos no Mercado Livre têm limite MÁXIMO de 60 caracteres. Cada título gerado DEVE ter no MÁXIMO 60 caracteres (incluindo espaços). NUNCA ultrapasse 60 caracteres.
2. Títulos NÃO devem conter palavras como "frete grátis", "promoção", "original", "o melhor", "imperdível" ou pontuação excessiva (como exclamações !!!), pois o algoritmo do ML penaliza o ranqueamento.
3. Estrutura recomendada pelo ML: [O que é o produto] + [Marca] + [Modelo] + [Especificação chave].
4. Descrição limpa, profissional, sem HTML complexo (o app do ML lê texto puro formatado com quebras de linha e tópicos claros).
5. Ficha técnica detalhada com atributos essenciais que completam o termômetro de qualidade do anúncio.

Retorne um JSON estrito conforme o schema definido.`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  titles: {
                    type: Type.ARRAY,
                    description: "Lista de 4 variações de títulos otimizados, cada um com <= 60 caracteres",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "Título com no máximo 60 caracteres" },
                        charCount: { type: Type.INTEGER, description: "Contagem de caracteres" },
                        strategy: { type: Type.STRING, description: "Estratégia usada (ex: Direto e Técnico, Foco em Especificação, Busca Mais Frequente, Variação Comercial)" }
                      },
                      required: ["title", "charCount", "strategy"]
                    }
                  },
                  technicalDescription: {
                    type: Type.STRING,
                    description: "Descrição completa e profissional sem HTML, pronta para colar no Mercado Livre"
                  },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Principais 4 a 6 benefícios em tópicos diretos"
                  },
                  technicalAttributes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING, description: "Nome do atributo da ficha técnica (ex: Marca, Modelo, Cor, Voltagem)" },
                        value: { type: Type.STRING, description: "Valor recomendado" }
                      },
                      required: ["name", "value"]
                    },
                    description: "Atributos da ficha técnica exigidos pelo catálogo do Mercado Livre"
                  },
                  suggestedCategory: {
                    type: Type.STRING,
                    description: "Caminho de categoria recomendado no Mercado Livre (ex: Informática > Periféricos > Teclados)"
                  },
                  keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Termos de busca mais digitados pelos compradores no ML"
                  },
                  photoGuide: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Roteiro recomendado para as 6 fotos do anúncio"
                  },
                  sellerTips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "3 dicas práticas para ranquear na primeira página do ML"
                  }
                },
                required: [
                  "titles",
                  "technicalDescription",
                  "bulletPoints",
                  "technicalAttributes",
                  "suggestedCategory",
                  "keywords",
                  "photoGuide",
                  "sellerTips"
                ]
              }
            }
          }),
          6000
        );

        if (response.text) {
          const parsed = JSON.parse(response.text);
          // Sanitize char count & ensure <= 60
          parsed.titles = parsed.titles.map((t: { title: string; charCount: number; strategy: string }) => {
            let cleanTitle = t.title.trim();
            if (cleanTitle.length > 60) {
              cleanTitle = cleanTitle.substring(0, 60).trim();
            }
            return {
              ...t,
              title: cleanTitle,
              charCount: cleanTitle.length,
            };
          });
          return res.json({ success: true, data: parsed, source: "ai" });
        }
      } catch (aiErr) {
        console.error("Gemini API error in optimize-listing, falling back to heuristic engine:", aiErr);
      }
    }

    // Heuristic Fallback engine for Mercado Livre listing optimization
    const baseProd = productName.trim();
    const bPart = brand ? ` ${brand.trim()}` : "";
    const mPart = model ? ` ${model.trim()}` : "";

    const candidate1 = `${baseProd}${bPart}${mPart}`.slice(0, 60).trim();
    const candidate2 = `${brand ? brand + " " : ""}${baseProd}${model ? " " + model : ""}`.slice(0, 60).trim();
    const candidate3 = `${baseProd} Original Com Garantia e NF`.slice(0, 60).trim();
    const candidate4 = `${baseProd}${mPart} Pronta Entrega`.slice(0, 60).trim();

    const titles = [
      { title: candidate1, charCount: candidate1.length, strategy: "Estrutura Padrão ML (Produto + Marca + Modelo)" },
      { title: candidate2, charCount: candidate2.length, strategy: "Foco em Marca Reconhecida" },
      { title: candidate3, charCount: candidate3.length, strategy: "Foco em Segurança e Procedência" },
      { title: candidate4, charCount: candidate4.length, strategy: "Foco em Disponibilidade Imediata" },
    ];

    const technicalDescription = `SEJA MUITO BEM-VINDO(A) À NOSSA LOJA NO MERCADO LIVRE!

PRODUTO: ${productName} ${brand} ${model}
CONDIÇÃO: ${condition === "new" ? "Novo e Lacrado" : "Revisado em Excelente Estado"}
GARANTIA: ${warrantyMonths} meses com emissão de Nota Fiscal

--------------------------------------------------
POR QUE ESCOLHER ESTE PRODUTO?
--------------------------------------------------
${keyFeatures || "Alta performance, durabilidade comprovada e excelente custo-benefício para seu dia a dia."}
- Produto 100% original e verificado antes do envio.
- Embalagem reforçada para transporte seguro.
- Envio rápido com rastreamento detalhado pelo Mercado Envios.

--------------------------------------------------
ESPECIFICAÇÕES TÉCNICAS (FICHA TÉCNICA)
--------------------------------------------------
- Marca: ${brand || "Original"}
- Modelo: ${model || "Padrão de Fábrica"}
- Condição: ${condition === "new" ? "Novo" : "Seminovo"}
- Garantia: ${warrantyMonths} meses
- Nota Fiscal: Sim (emitida no nome do comprador)

--------------------------------------------------
ITENS INCLUSOS NA EMBALAGEM
--------------------------------------------------
- 1x ${productName}
- Manual de instruções e certificado de garantia

--------------------------------------------------
PERGUNTAS FREQUENTES (FAQ)
--------------------------------------------------
1. O produto é novo?
R: Sim, produto totalmente novo, lacrado na caixa.

2. Tem pronta entrega e emite Nota Fiscal?
R: Sim! Todos os nossos produtos estão em estoque no Brasil com envio imediato e Nota Fiscal emitida para CPF ou CNPJ.

3. Qual o prazo de envio?
R: Pedidos aprovados são despachados no mesmo dia útil ou em até 24 horas úteis.

Caso tenha qualquer dúvida adicional, utilize o campo de perguntas abaixo. Nossa equipe está à disposição para te atender!`;

    const technicalAttributes = [
      { name: "Marca", value: brand || "Original" },
      { name: "Modelo", value: model || "Padrão" },
      { name: "Condição do item", value: condition === "new" ? "Novo" : "Usado" },
      { name: "Disponibilidade de estoque", value: "Pronta entrega imediata" },
      { name: "Garantia do vendedor", value: `${warrantyMonths} meses` },
      { name: "Tipo de envio", value: "Mercado Envios (com seguro)" },
    ];

    res.json({
      success: true,
      source: "heuristic",
      data: {
        titles,
        technicalDescription,
        bulletPoints: [
          "Envio ultra-rápido com seguro pelo Mercado Envios",
          "Acompanha Nota Fiscal emitida para CPF ou CNPJ",
          `Garantia assegurada de ${warrantyMonths} meses`,
          "Atendimento pós-venda dedicado via mensagem privada",
        ],
        technicalAttributes,
        suggestedCategory: category || "Mais Vendidos > Categoria Geral",
        keywords: [
          productName.toLowerCase(),
          brand ? brand.toLowerCase() : "",
          model ? model.toLowerCase() : "",
          "original",
          "pronta entrega",
          "com nota fiscal",
          "garantia",
        ].filter(Boolean),
        photoGuide: [
          "Foto 1: Fundo 100% branco puro (RGB 255,255,255), sem sombras duras, sem texto nem bordas",
          "Foto 2: Ângulo lateral e traseiro destacando conexões ou acabamentos",
          "Foto 3: Foto em uso/contexto (Lifestyle) demonstrando o tamanho real",
          "Foto 4: Foto com medidas e dimensões exatas em centímetros",
          "Foto 5: Embalagem e todos os acessórios que acompanham o produto",
          "Foto 6: Infográfico resumindo os 3 principais benefícios",
        ],
        sellerTips: [
          "Mantenha o tempo de resposta nas perguntas abaixo de 10 minutos para subir no ranking.",
          "Preencha todos os atributos da Ficha Técnica para o Mercado Livre recomendar seu anúncio no topo.",
          "Use a primeira foto com fundo branco puro em alta resolução (mínimo 1200x1200px).",
        ],
      },
    });
  } catch (err) {
    console.error("Error in /api/ml/optimize-listing:", err);
    res.status(500).json({ error: "Erro ao processar otimização do anúncio." });
  }
});

// Endpoint: Gerador de Respostas Pré-Venda Mercado Livre (SAC)
app.post("/api/ml/answer-question", async (req, res) => {
  try {
    const {
      question,
      productContext = "",
      deliveryType = "full",
      hasInvoice = true,
      hasWarranty = true,
    } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A pergunta do comprador é obrigatória." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Você é um especialista em atendimento e fechamento de vendas no Mercado Livre (Brasil).
Um comprador em potencial fez a seguinte pergunta no anúncio:

Pergunta do Comprador: "${question}"
Contexto do Produto: "${productContext || "Produto anunciado no Mercado Livre"}"
Modalidade de Envio: ${deliveryType === "full" ? "Mercado Livre Full (entrega mais rápida do Brasil)" : deliveryType === "flex" ? "Mercado Envios Flex (chega no mesmo dia)" : "Mercado Envios Normal"}
Emite Nota Fiscal: ${hasInvoice ? "Sim, com NF no nome do comprador" : "Não informada"}
Tem Garantia: ${hasWarranty ? "Sim, com garantia total" : "Não informada"}

Gere exatamente 3 variações de respostas profissionais em português do Brasil:
1. "Cortês & Direta": Resposta rápida, amigável, clara e objetiva que responde com precisão.
2. "Técnica & Completa": Esclarece detalhes técnicos, segurança, procedência e garantia.
3. "Gatilho de Urgência & Fechamento": Focada em conversão imediata, lembrando que temos poucas unidades ou que postamos hoje mesmo no ${deliveryType === "full" ? "Full" : "envio rápido"}.

REGRAS DO MERCADO LIVRE PARA RESPOSTAS:
- NUNCA informe dados de contato pessoal (telefone, WhatsApp, e-mail, Instagram, site externo) pois o Mercado Livre bloqueia o anúncio.
- NUNCA use palavras de baixo calão.
- Seja simpático, solícito e termine convidando a finalizar a compra com segurança.`;

        const response = await withTimeout(
          ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        tone: { type: Type.STRING, description: "Nome do tom: Cortês & Direta, Técnica & Completa, ou Gatilho de Urgência" },
                        text: { type: Type.STRING, description: "Texto exato da resposta pronta para copiar" },
                        explanation: { type: Type.STRING, description: "Quando usar esta resposta" }
                      },
                      required: ["tone", "text", "explanation"]
                    }
                  },
                  conversionTip: {
                    type: Type.STRING,
                    description: "Dica rápida para converter esse tipo de pergunta em venda no ML"
                  }
                },
                required: ["options", "conversionTip"]
              }
            }
          }),
          5000
        );

        if (response.text) {
          return res.json({ success: true, data: JSON.parse(response.text), source: "ai" });
        }
      } catch (aiErr) {
        console.error("Gemini API error in answer-question:", aiErr);
      }
    }

    // Heuristic response
    const shippingText = deliveryType === "full"
      ? "Enviamos imediatamente pelo Mercado Livre Full, o frete mais rápido e seguro do Brasil!"
      : deliveryType === "flex"
      ? "Temos envio Flex! Comprando até o horário limite, seu pedido chega hoje mesmo!"
      : "Temos a pronta entrega com envio imediato e rastreado pelo Mercado Envios.";

    const nfText = hasInvoice ? " Acompanha Nota Fiscal emitida no seu nome e garantia de fábrica." : "";

    res.json({
      success: true,
      source: "heuristic",
      data: {
        options: [
          {
            tone: "Cortês & Direta",
            text: `Olá! Muito obrigado pelo contato. Sim, temos a pronta entrega! ${shippingText}${nfText} Qualquer dúvida estamos à total disposição. Aguardo sua compra!`,
            explanation: "Ideal para compradores que querem apenas confirmar disponibilidade e fechar rápido.",
          },
          {
            tone: "Técnica & Completa",
            text: `Olá, tudo bem? Obrigado pelo interesse em nosso produto! O item é 100% original, novo e testado antes do envio.${nfText} ${shippingText} Se precisar de mais informações técnicas, estamos à disposição. Será um prazer atender você!`,
            explanation: "Excelente para tirar inseguranças sobre originalidade, procedência e garantia.",
          },
          {
            tone: "Gatilho de Urgência",
            text: `Olá! Temos as últimas unidades disponíveis com preço promocional para envio imediato hoje mesmo pelo ${deliveryType === "full" ? "Full" : "Mercado Envios"}. Garanta o seu agora para despacharmos nas próximas horas!`,
            explanation: "Perfeita para acelerar a decisão do comprador e evitar que ele pesquise o concorrente.",
          },
        ],
        conversionTip: "Responda em menos de 10 minutos. No Mercado Livre, respostas em até 8 minutos aumentam a taxa de conversão em mais de 40%.",
      },
    });
  } catch (err) {
    console.error("Error in /api/ml/answer-question:", err);
    res.status(500).json({ error: "Erro ao gerar respostas." });
  }
});

// Endpoint: Auditor de Anúncio Mercado Livre
app.post("/api/ml/audit-listing", async (req, res) => {
  try {
    const {
      title = "",
      price = 0,
      description = "",
      hasWhiteBackgroundPhoto = true,
      photosCount = 1,
      hasAttributesFilled = false,
      listingType = "classico",
    } = req.body;

    const titleLen = title.trim().length;
    let score = 100;
    const issues: { type: "critical" | "warning" | "success"; text: string; action: string }[] = [];

    // Title validation
    if (titleLen === 0) {
      score -= 40;
      issues.push({
        type: "critical",
        text: "Título não informado.",
        action: "Insira o título do anúncio para análise.",
      });
    } else if (titleLen > 60) {
      score -= 25;
      issues.push({
        type: "critical",
        text: `Título muito longo (${titleLen}/60 caracteres). O Mercado Livre corta e penaliza títulos com mais de 60 chars.`,
        action: `Encurte ${titleLen - 60} caracteres removendo adjetivos desnecessários.`,
      });
    } else if (titleLen < 30) {
      score -= 15;
      issues.push({
        type: "warning",
        text: `Título curto (${titleLen}/60 caracteres). Você está perdendo espaço valioso para palavras-chave de busca.`,
        action: "Adicione modelo, cor ou especificação técnica principal para chegar próximo de 55 a 60 caracteres.",
      });
    } else {
      issues.push({
        type: "success",
        text: `Tamanho de título excelente (${titleLen}/60 caracteres).`,
        action: "Mantenha a estrutura [Produto] [Marca] [Modelo] [Atributo Chave].",
      });
    }

    // Banned terms check in title
    const bannedWords = ["frete gratis", "frete grátis", "promoção", "promocao", "melhor", "original", "imperdivel", "imperdível", "barato", "oferta"];
    const foundBanned = bannedWords.filter((w) => title.toLowerCase().includes(w));
    if (foundBanned.length > 0) {
      score -= 15;
      issues.push({
        type: "critical",
        text: `Termos penalizados detectados no título: "${foundBanned.join(", ")}".`,
        action: "Remova essas palavras do título. O algoritmo do Mercado Livre pune termos como 'frete grátis' e 'promoção' no título.",
      });
    }

    // Photos check
    if (!hasWhiteBackgroundPhoto) {
      score -= 20;
      issues.push({
        type: "critical",
        text: "Primeira foto sem fundo branco puro (RGB 255,255,255).",
        action: "A primeira foto OBRIGATORIAMENTE deve ter fundo branco puro, sem marca d'água e sem molduras, senão perde relevância e elegibilidade para catálogo.",
      });
    } else {
      issues.push({
        type: "success",
        text: "Primeira foto com fundo branco atende as diretrizes do catálogo ML.",
        action: "Certifique-se de que a resolução seja de pelo menos 1200x1200px para ativar o zoom.",
      });
    }

    if (photosCount < 4) {
      score -= 15;
      issues.push({
        type: "warning",
        text: `Poucas fotos (${photosCount} fotos). O Mercado Livre recomenda no mínimo 4 a 6 fotos.`,
        action: "Adicione fotos de ângulos diferentes, foto em uso/escala e foto dos itens inclusos.",
      });
    } else {
      issues.push({
        type: "success",
        text: `Boa quantidade de fotos (${photosCount} fotos).`,
        action: "Adicione infográficos de medidas e diferenciais.",
      });
    }

    // Price & Free Shipping rule
    if (price >= 79) {
      issues.push({
        type: "success",
        text: `Preço de R$ ${price.toFixed(2)}: Elegível ao Frete Grátis obrigatório do Mercado Livre (produtos a partir de R$ 79,00).`,
        action: "Verifique se a margem de lucro absorve a taxa de frete do vendedor com desconto de reputação.",
      });
    } else if (price > 0 && price < 79) {
      issues.push({
        type: "warning",
        text: `Preço abaixo de R$ 79,00: O Mercado Livre cobra taxa fixa de R$ 6,00 por unidade vendida além da porcentagem da comissão.`,
        action: "Considere criar kits de 2 ou mais unidades para ultrapassar R$ 79,00 e diluir a taxa fixa unitária.",
      });
    }

    // Attributes check
    if (!hasAttributesFilled) {
      score -= 15;
      issues.push({
        type: "critical",
        text: "Ficha Técnica incompleta ou vazia.",
        action: "Preencha todos os campos da ficha técnica (Marca, Modelo, EAN/Código de barras universal). Anúncios com ficha completa aparecem nos filtros de busca!",
      });
    } else {
      issues.push({
        type: "success",
        text: "Ficha Técnica preenchida.",
        action: "Mantenha o código de barras (EAN/GTIN) sempre válido para competir pelo catálogo.",
      });
    }

    // Description check
    if (!description || description.trim().length < 100) {
      score -= 15;
      issues.push({
        type: "warning",
        text: "Descrição muito curta ou ausente.",
        action: "Crie uma descrição detalhada com apresentação, lista de itens inclusos, especificações e garantia.",
      });
    }

    score = Math.max(10, Math.min(100, score));

    let tier = "Ruim";
    let tierColor = "red";
    if (score >= 85) {
      tier = "Ouro (Excelente)";
      tierColor = "emerald";
    } else if (score >= 65) {
      tier = "Prata (Bom, com melhorias)";
      tierColor = "amber";
    } else {
      tier = "Bronze (Precisa de correções urgentes)";
      tierColor = "rose";
    }

    res.json({
      success: true,
      score,
      tier,
      tierColor,
      issues,
    });
  } catch (err) {
    console.error("Error in /api/ml/audit-listing:", err);
    res.status(500).json({ error: "Erro ao auditar anúncio." });
  }
});

// Vite middleware / production serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
