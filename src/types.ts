export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  suggestedSalePrice: number;
  image: string;
  category: string;
  stock: number;
  weightKg: number;
  dimensions: { length: number; width: number; height: number };
  description: string;
  isRegistered?: boolean;
  registeredStores?: string[];
  registeredDate?: string;
  syncedPrice?: number;
  marketplaceLink?: string;
  status?: "falha" | "ativo" | "disponivel" | "pausado";
  errorMessage?: string;
}

export interface TitleOption {
  title: string;
  charCount: number;
  strategy: string;
}

export interface TechnicalAttribute {
  name: string;
  value: string;
}

export interface OptimizedListingData {
  titles: TitleOption[];
  technicalDescription: string;
  bulletPoints: string[];
  technicalAttributes: TechnicalAttribute[];
  suggestedCategory: string;
  keywords: string[];
  photoGuide: string[];
  sellerTips: string[];
}

export interface ListingFormData {
  productName: string;
  brand: string;
  model: string;
  category: string;
  keyFeatures: string;
  price: number;
  condition: "new" | "used";
  warrantyMonths: number;
}

export interface QuestionAnswerOption {
  tone: string;
  text: string;
  explanation: string;
}

export interface QuestionAnswerData {
  options: QuestionAnswerOption[];
  conversionTip: string;
}

export interface AuditIssue {
  type: "critical" | "warning" | "success";
  text: string;
  action: string;
}

export interface AuditResult {
  score: number;
  tier: string;
  tierColor: string;
  issues: AuditIssue[];
}

export interface SavedListing {
  id: string;
  createdAt: string;
  productName: string;
  brand: string;
  price: number;
  selectedTitle: string;
  data: OptimizedListingData;
}

export interface Order {
  id: string;
  orderNumber: string;
  marketplace: "Mercado Livre" | "Shopee" | "Amazon" | "Magalu";
  customerName: string;
  customerCity: string;
  customerState: string;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  salePrice: number;
  costPrice: number;
  feeMarketplace: number;
  shippingPaidByBuyer: boolean;
  profit: number;
  status: "Pendente" | "Pronto para envio" | "Enviado" | "Entregue" | "Cancelado";
  date: string;
  trackingCode?: string;
  totalAmount?: number;
  items?: any[];
}

export interface StoreIntegration {
  id: string;
  name: string;
  platform: "Mercado Livre" | "Shopee" | "Amazon" | "Magalu" | "Shein" | "TikTok Shop";
  connected: boolean;
  accountEmail: string;
  syncedProductsCount: number;
  lastSync: string;
  logo: string;
  status: "Ativo" | "Aguardando Token" | "Erro de Auth" | "Desconectado";
}

export interface WalletTransaction {
  id: string;
  type: "credit" | "debit";
  title: string;
  amount: number;
  date: string;
  paymentMethod: "PIX" | "Cartão" | "Boleto" | "Comissão Marketplace";
  status: "Concluído" | "Processando" | "Falha";
}

export type MainNavTab = 
  | "dashboard" 
  | "catalogo" 
  | "meus-produtos" 
  | "pedidos" 
  | "financeiro" 
  | "integracoes" 
  | "notificacoes" 
  | "chamados" 
  | "ferramentas" 
  | "tutoriais";
