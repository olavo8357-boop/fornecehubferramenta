export interface MLCategoryFee {
  id: string;
  name: string;
  classicoRate: number; // percentage (e.g., 12%)
  premiumRate: number;  // percentage (e.g., 17%)
  averageShipping: number; // R$ estimate for standard package
}

export const ML_CATEGORIES: MLCategoryFee[] = [
  { id: "informatica", name: "Informática e Acessórios", classicoRate: 11.5, premiumRate: 16.5, averageShipping: 21.9 },
  { id: "celulares", name: "Celulares e Telefones", classicoRate: 11.0, premiumRate: 16.0, averageShipping: 20.5 },
  { id: "eletronicos", name: "Eletrônicos, Áudio e Vídeo", classicoRate: 12.0, premiumRate: 17.0, averageShipping: 23.0 },
  { id: "casa", name: "Casa, Móveis e Decoração", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 28.5 },
  { id: "ferramentas", name: "Ferramentas e Construção", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 26.0 },
  { id: "auto", name: "Acessórios para Veículos / Autopeças", classicoRate: 13.5, premiumRate: 18.5, averageShipping: 24.5 },
  { id: "beleza", name: "Beleza e Cuidado Pessoal", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 19.9 },
  { id: "moda", name: "Calçados, Roupas e Bolsas", classicoRate: 14.0, premiumRate: 19.0, averageShipping: 21.0 },
  { id: "esportes", name: "Esportes e Fitness", classicoRate: 12.5, premiumRate: 17.5, averageShipping: 24.0 },
  { id: "brinquedos", name: "Brinquedos e Hobbies", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 22.0 },
  { id: "games", name: "Games e Consoles", classicoRate: 11.5, premiumRate: 16.5, averageShipping: 21.5 },
  { id: "saude", name: "Saúde e Equipamentos Médicos", classicoRate: 12.5, premiumRate: 17.5, averageShipping: 22.0 },
  { id: "bebes", name: "Bebês e Maternidade", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 23.0 },
  { id: "outros", name: "Outras Categorias Gerais", classicoRate: 13.0, premiumRate: 18.0, averageShipping: 24.0 },
];

export const ML_RULES = {
  fixedFeeThreshold: 79.0, // Products with sale price below R$ 79 pay fixed fee
  fixedFeePerUnit: 6.0,    // R$ 6,00 fixed tariff per unit sold for < R$ 79
  freeShippingThreshold: 79.0, // >= R$ 79 seller MUST offer free shipping (Mercado Envios)
  reputationDiscounts: [
    { label: "Verde Escuro (MercadoLíder / Platinum / Gold)", discount: 0.50, description: "50% de desconto no frete pago pelo vendedor" },
    { label: "Verde Claro (Boa reputação)", discount: 0.40, description: "40% de desconto no frete" },
    { label: "Amarela (Reputação média)", discount: 0.0, description: "Sem desconto no frete" },
    { label: "Laranja / Vermelha", discount: -0.20, description: "Tarifa com acréscimo de penalidade" },
  ]
};
