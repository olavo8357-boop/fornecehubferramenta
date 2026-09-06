import React, { useState } from "react";
import { 
  Package, 
  Search, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Plus,
  Layers,
  LayoutGrid,
  List,
  Store,
  Check,
  Copy,
  X,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";
import { CatalogProduct, MainNavTab } from "../types";
import { formatCurrency } from "../utils";

interface MyProductsViewProps {
  products: CatalogProduct[];
  onNavigateToTab: (tab: MainNavTab) => void;
  onOpenRegisterModal: (product: CatalogProduct) => void;
}

export const MyProductsView: React.FC<MyProductsViewProps> = ({
  products,
  onNavigateToTab,
  onOpenRegisterModal
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSkuModalOpen, setIsSkuModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [copiedSku, setCopiedSku] = useState<string | null>(null);

  const registeredProducts = products.filter((p) => p.isRegistered);

  const filtered = registeredProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  const handleOpenNewProduct = () => {
    setIsNewProductModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header matching exact screenshot structure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Meus Produtos</h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            {registeredProducts.length} produto(s) — sincronizado com Minha loja
          </p>
        </div>

        {/* Action Toolbar on Right */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* SKU Button */}
          <button
            id="btn-sku-toggle"
            onClick={() => setIsSkuModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#111622] hover:bg-[#182030] border border-[#1e2738] text-neutral-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            title="Gerenciar e visualizar SKUs cadastrados"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>SKU</span>
          </button>

          {/* View Toggle (Grid / List) */}
          <div className="bg-[#111622] border border-[#1e2738] p-0.5 rounded-lg flex items-center gap-0.5 shadow-sm">
            <button
              id="btn-view-grid"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === "grid"
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-view-list"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === "list"
                  ? "bg-[#1e293b] text-white shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
              title="Visualização em Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* + Novo Produto Button */}
          <button
            id="btn-new-product"
            onClick={handleOpenNewProduct}
            className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Main Content: Empty State OR Products View */}
      {registeredProducts.length === 0 ? (
        /* Empty State matching screenshot exactly */
        <div className="border border-dashed border-[#1e2738] bg-[#0c0f17]/60 rounded-2xl p-12 sm:p-24 flex flex-col items-center justify-center text-center min-h-[420px] transition">
          {/* Centered Box Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#141a29] border border-[#222d42] flex items-center justify-center mx-auto mb-4 text-neutral-300 shadow-inner">
            <Package className="w-6 h-6 stroke-[1.8] text-sky-400" />
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-bold text-white mb-1.5">
            Nenhum produto ainda
          </h2>

          {/* Description */}
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 leading-relaxed">
            Adicione produtos pelo Catálogo. Eles aparecem aqui automaticamente com o símbolo do marketplace.
          </p>

          {/* CTA Button */}
          <button
            id="btn-new-product-empty"
            onClick={handleOpenNewProduct}
            className="px-4 py-2 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-lg text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo Produto</span>
          </button>
        </div>
      ) : (
        /* Populated Products State */
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0d0922]/80 border border-[#241a4a] p-3 rounded-2xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título ou SKU..."
                className="w-full bg-[#140e2e] border border-[#291f52] rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Total: <strong className="text-white">{filtered.length}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Sincronizados
              </span>
            </div>
          </div>

          {/* View Mode: Grid vs List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((prod) => {
                const salePrice = prod.syncedPrice ?? prod.suggestedSalePrice;
                const profit = salePrice - prod.costPrice - (salePrice * 0.16);

                return (
                  <div 
                    key={prod.id}
                    className="bg-[#0e0a24]/90 border border-[#261d4e] hover:border-purple-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition group hover:shadow-xl hover:shadow-purple-950/20"
                  >
                    <div>
                      {/* Image container with Marketplace Badge */}
                      <div className="relative aspect-square w-full bg-white/5 p-3 flex items-center justify-center overflow-hidden border-b border-[#261d4e]">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                        />

                        {/* Marketplace Symbol Badge ("com o símbolo do marketplace") */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg bg-[#ffe600] text-neutral-900 font-extrabold text-[10px] flex items-center gap-1 shadow-md border border-amber-400">
                          <Store className="w-3 h-3 text-neutral-900" />
                          <span>Mercado Livre</span>
                        </div>

                        {/* Stock pill */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-neutral-300 font-mono text-[10px] border border-white/10">
                          {prod.stock} un.
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-purple-300/80 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30">
                            {prod.sku}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Ativo
                          </span>
                        </div>

                        <h3 className="text-xs font-semibold text-white line-clamp-2 leading-relaxed min-h-[36px]">
                          {prod.name}
                        </h3>

                        {/* Pricing */}
                        <div className="pt-2 border-t border-[#261d4e] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-neutral-400 block">Preço Anunciado</span>
                            <span className="text-sm font-bold text-emerald-400 font-mono">
                              {formatCurrency(salePrice)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block">Custo Fornecedor</span>
                            <span className="text-xs text-neutral-300 font-mono">
                              {formatCurrency(prod.costPrice)}
                            </span>
                          </div>
                        </div>

                        {profit > 0 && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-300">Lucro est. por venda:</span>
                            <span className="font-bold text-emerald-400 font-mono">+{formatCurrency(profit)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => onOpenRegisterModal(prod)}
                        className="flex-1 py-1.5 bg-[#171138] hover:bg-[#20184c] text-purple-200 hover:text-white border border-[#2f235e] rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Atualizar</span>
                      </button>

                      {prod.marketplaceLink && (
                        <a
                          href={prod.marketplaceLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-[#171138] hover:bg-[#20184c] text-neutral-300 hover:text-white border border-[#2f235e] rounded-xl transition"
                          title="Ver anúncio no Marketplace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#0e0a24]/90 border border-[#261d4e] rounded-2xl overflow-hidden divide-y divide-[#261d4e]">
              <div className="p-3 bg-[#130d30] grid grid-cols-12 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <div className="col-span-5">Produto & SKU</div>
                <div className="col-span-2 text-center">Marketplace</div>
                <div className="col-span-2 text-right">Preço de Venda</div>
                <div className="col-span-1 text-center">Estoque</div>
                <div className="col-span-2 text-right">Ações</div>
              </div>

              {filtered.map((prod) => {
                const salePrice = prod.syncedPrice ?? prod.suggestedSalePrice;

                return (
                  <div key={prod.id} className="p-3.5 grid grid-cols-12 items-center hover:bg-purple-950/20 transition">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-11 h-11 bg-white/5 rounded-lg p-1 flex-shrink-0 flex items-center justify-center border border-white/10">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-purple-300/80 block">{prod.sku}</span>
                        <h4 className="text-xs font-semibold text-white truncate">{prod.name}</h4>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span className="px-2 py-0.5 rounded-lg bg-[#ffe600] text-neutral-900 font-extrabold text-[10px] flex items-center gap-1 shadow-sm">
                        <Store className="w-2.5 h-2.5" /> Mercado Livre
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="text-xs font-bold text-emerald-400 font-mono block">
                        {formatCurrency(salePrice)}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Custo: {formatCurrency(prod.costPrice)}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <span className="text-xs font-mono text-neutral-200">{prod.stock} un</span>
                    </div>

                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenRegisterModal(prod)}
                        className="px-2.5 py-1 bg-[#171138] hover:bg-[#20184c] text-purple-200 hover:text-white border border-[#2f235e] rounded-lg text-xs font-semibold transition flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Atualizar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SKU Modal */}
      {isSkuModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120d2a] border border-[#2a2055] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#241a4a]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Gerenciador de SKUs</h3>
                  <p className="text-[11px] text-neutral-400">Códigos de estoque e identificação única</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSkuModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Aqui estão todos os SKUs associados aos produtos sincronizados com suas lojas conectadas.
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1 divide-y divide-[#241a4a]">
              {registeredProducts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Nenhum SKU ativo no momento. Adicione produtos no catálogo para listar.
                </div>
              ) : (
                registeredProducts.map((p) => (
                  <div key={p.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-purple-300 block">{p.sku}</span>
                      <span className="text-neutral-400 truncate max-w-xs block text-[11px]">{p.name}</span>
                    </div>
                    <button
                      onClick={() => handleCopySku(p.sku)}
                      className="px-2.5 py-1 rounded-lg bg-[#1a133d] hover:bg-[#251b54] text-neutral-300 text-[11px] flex items-center gap-1 border border-purple-900/30 transition"
                    >
                      {copiedSku === p.sku ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#241a4a] flex items-center justify-end">
              <button
                onClick={() => setIsSkuModalOpen(false)}
                className="px-4 py-2 bg-[#1a133d] hover:bg-[#241b52] text-white rounded-xl text-xs font-semibold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick "+ Novo Produto" Selector Modal */}
      {isNewProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#120d2a] border border-[#2a2055] rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#241a4a]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-300">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cadastrar Novo Produto na Loja</h3>
                  <p className="text-[11px] text-neutral-400">Selecione itens do catálogo ForneceHub para sincronizar</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewProductModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 bg-[#181138] p-3 rounded-xl text-xs text-neutral-300 border border-[#2d225a]">
              <span>💡 Quer explorar todas as categorias com filtros avançados?</span>
              <button
                onClick={() => {
                  setIsNewProductModalOpen(false);
                  onNavigateToTab("catalogo");
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm whitespace-nowrap"
              >
                Ir ao Catálogo <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-[#241a4a]">
              {products.filter(p => !p.isRegistered).slice(0, 6).map((p) => (
                <div key={p.id} className="pt-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white/5 rounded-lg p-1 flex-shrink-0 flex items-center justify-center border border-white/10">
                      <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] text-purple-300/80 block">{p.sku}</span>
                      <h4 className="text-xs font-semibold text-white truncate max-w-sm">{p.name}</h4>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        Custo: {formatCurrency(p.costPrice)} • Venda sug.: {formatCurrency(p.suggestedSalePrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsNewProductModalOpen(false);
                      onOpenRegisterModal(p);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1 flex-shrink-0 shadow-sm transition active:scale-95"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                    <span>Sincronizar</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#241a4a] flex items-center justify-between">
              <button
                onClick={() => {
                  setIsNewProductModalOpen(false);
                  onNavigateToTab("catalogo");
                }}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                Ver todos os produtos do catálogo →
              </button>

              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="px-4 py-2 bg-[#1a133d] hover:bg-[#241b52] text-white rounded-xl text-xs font-semibold transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

