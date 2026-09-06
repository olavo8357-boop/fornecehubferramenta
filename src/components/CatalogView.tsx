import React, { useState, useMemo } from "react";
import { 
  Search, 
  Store, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Sparkles, 
  Package, 
  ExternalLink,
  Plus,
  ArrowUpDown,
  Filter,
  Layers,
  Zap,
  TrendingUp,
  Tag,
  ArrowRight,
  AlertTriangle,
  RotateCw
} from "lucide-react";
import { CatalogProduct } from "../types";
import { formatCurrency } from "../utils";

interface CatalogViewProps {
  products: CatalogProduct[];
  onOpenRegisterModal: (product: CatalogProduct) => void;
  onOpenQuickOptimizeModal?: (product: CatalogProduct) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onOpenRegisterModal,
  onOpenQuickOptimizeModal
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("Todas as lojas");
  const [activeStatusFilter, setActiveStatusFilter] = useState<"todos" | "cadastrado">("todos");
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc" | "stock-desc" | "margin-desc">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ["Todas", ...Array.from(cats)];
  }, [products]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = activeStatusFilter === "todos" 
        ? true 
        : p.isRegistered === true;
      const matchesCategory = selectedCategory === "Todas" || p.category === selectedCategory;
      const matchesStore = selectedStore === "Todas as lojas" || 
                           (p.registeredStores && p.registeredStores.some(s => s.toLowerCase().includes(selectedStore.toLowerCase())));

      return matchesSearch && matchesStatus && matchesCategory && matchesStore;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.costPrice - b.costPrice;
      if (sortBy === "price-desc") return b.costPrice - a.costPrice;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      if (sortBy === "margin-desc") {
        const marginA = (a.suggestedSalePrice - a.costPrice) / a.suggestedSalePrice;
        const marginB = (b.suggestedSalePrice - b.costPrice) / b.suggestedSalePrice;
        return marginB - marginA;
      }
      return 0; // Default recent order
    });
  }, [products, searchTerm, selectedStore, activeStatusFilter, sortBy, selectedCategory]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Filter Bar (Apple Frosted Glass) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#121216]/80 backdrop-blur-2xl p-3 rounded-2xl border border-white/[0.08] shadow-2xl">
        {/* Left: Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome de produto ou código SKU..."
            className="w-full bg-black/50 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#af52de] focus:ring-1 focus:ring-[#af52de]/50 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-300 hover:text-white bg-white/[0.1] px-2 py-0.5 rounded-md transition"
            >
              Limpar
            </button>
          )}
        </div>

        {/* Center/Right Controls: Store Dropdown + Filter Pills + Sort Dropdown + Grid/List Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Store Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-neutral-200">
              <Store className="w-3.5 h-3.5 text-[#bf5af2]" />
              <select
                id="catalog-store-select"
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                aria-label="Filtrar por loja"
                className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="Todas as lojas" className="bg-[#16161c] text-white">Todas as lojas</option>
                <option value="Mercado Livre" className="bg-[#16161c] text-white">Mercado Livre Loja 1</option>
                <option value="Shopee" className="bg-[#16161c] text-white">Shopee Oficial</option>
                <option value="Amazon" className="bg-[#16161c] text-white">Amazon Brasil</option>
              </select>
            </div>
          </div>

          {/* Status Filter Pills [ Todos | Cadastrado ] (Apple Segmented Style) */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/[0.08]">
            <button
              id="filter-status-todos-btn"
              onClick={() => setActiveStatusFilter("todos")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeStatusFilter === "todos"
                  ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.1]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Todos
            </button>
            <button
              id="filter-status-cadastrado-btn"
              onClick={() => setActiveStatusFilter("cadastrado")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeStatusFilter === "cadastrado"
                  ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.1]"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cadastrado
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-1.5 bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-neutral-200">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#bf5af2]" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Ordenar produtos por"
                className="bg-transparent text-xs text-neutral-200 focus:outline-none cursor-pointer pr-1 font-medium"
              >
                <option value="recent" className="bg-[#16161c] text-white">Mais recentes</option>
                <option value="margin-desc" className="bg-[#16161c] text-white">Maior margem %</option>
                <option value="price-asc" className="bg-[#16161c] text-white">Menor custo</option>
                <option value="price-desc" className="bg-[#16161c] text-white">Maior custo</option>
                <option value="stock-desc" className="bg-[#16161c] text-white">Maior estoque</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/[0.08]">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white/[0.12] text-white border border-white/[0.1]"
                  : "text-neutral-400 hover:text-white"
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-mode-list-btn"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white/[0.12] text-white border border-white/[0.1]"
                  : "text-neutral-400 hover:text-white"
              }`}
              title="Visualização em Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Slider (Apple Minimalist Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-neutral-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1.5 text-xs">
          <Tag className="w-3.5 h-3.5 text-[#bf5af2]" /> Categorias:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition ${
              selectedCategory === cat
                ? "bg-[#af52de] text-white shadow-[0_2px_10px_rgba(175,82,222,0.35)]"
                : "bg-white/[0.05] text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>
          Mostrando <strong className="text-white">{filteredProducts.length}</strong> produtos
          {selectedCategory !== "Todas" && ` em ${selectedCategory}`}
          {activeStatusFilter === "cadastrado" && " (Apenas cadastrados)"}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#af52de] animate-ping"></span>
          <span className="text-neutral-300 font-medium">Estoque & Preços Integrados em Tempo Real</span>
        </div>
      </div>

      {/* Product List / Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-[#121216]/80 backdrop-blur-2xl rounded-2xl border border-white/[0.08]">
          <Package className="w-12 h-12 text-[#bf5af2]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1 tracking-tight">Nenhum produto encontrado</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
            Tente mudar o termo da busca ou remover os filtros de categoria e status.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("Todas");
              setActiveStatusFilter("todos");
              setSelectedStore("Todas as lojas");
            }}
            className="px-4 py-2 bg-[#af52de] hover:bg-[#bf5af2] text-white text-xs font-medium rounded-xl transition shadow-[0_2px_12px_rgba(175,82,222,0.3)] active:scale-95"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW (Apple Clean Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const estimatedProfit = product.suggestedSalePrice - product.costPrice - (product.suggestedSalePrice * 0.16 + 6);
            return (
              <div
                key={product.id}
                className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-white/[0.2] rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-2xl hover:shadow-black/60 group relative"
              >
                {/* Image Container with Crisp White Background */}
                <div className="relative">
                  <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-3 mb-3 overflow-hidden shadow-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {/* Registered Badge */}
                  {product.isRegistered && (
                    <div className="absolute top-2 right-2 bg-emerald-500/90 text-white font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Cadastrado
                    </div>
                  )}

                  {/* Stock tag */}
                  <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/[0.1]">
                    Estoque: {product.stock} un
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h3 
                      className="text-xs font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#d884ff] transition tracking-tight"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-400 mt-1">
                      SKU: <span className="text-neutral-300">{product.sku}</span>
                    </p>
                  </div>

                  {/* Price and Margins */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-normal">Custo Fornecedor</span>
                        <span className="text-base font-bold text-emerald-400 tracking-tight font-mono">
                          {formatCurrency(product.costPrice)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block font-normal">Venda Sugerida</span>
                        <span className="text-xs font-semibold text-neutral-200 font-mono">
                          {formatCurrency(product.suggestedSalePrice)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
                      <span>Lucro Estimado ML:</span>
                      <span className="text-emerald-400 font-semibold font-mono">
                        +{estimatedProfit > 0 ? formatCurrency(estimatedProfit) : "R$ 0,00"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Apple Purple Button */}
                  <div className="pt-2">
                    <button
                      id={`btn-register-product-${product.id}`}
                      onClick={() => onOpenRegisterModal(product)}
                      className={`w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        product.isRegistered
                          ? "bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 border border-white/[0.1] active:scale-[0.98]"
                          : "bg-[#af52de] hover:bg-[#bf5af2] text-white shadow-[0_2px_12px_rgba(175,82,222,0.35)] active:scale-[0.98]"
                      }`}
                    >
                      {product.isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Gerenciar no Marketplace
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          Cadastrar no Marketplace
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-[#121216]/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06] shadow-2xl">
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-white/[0.02] transition">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1.5 flex-shrink-0 shadow-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">SKU: {product.sku}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] text-neutral-300 font-medium border border-white/[0.08]">{product.category}</span>
                    {product.isRegistered && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-medium border border-emerald-500/30">Cadastrado</span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-white mt-1 tracking-tight">{product.name}</h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{product.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Custo</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {formatCurrency(product.costPrice)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Venda Sugerida</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {formatCurrency(product.suggestedSalePrice)}
                  </span>
                </div>
                <button
                  onClick={() => onOpenRegisterModal(product)}
                  className="px-4 py-2 bg-[#af52de] hover:bg-[#bf5af2] text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-[0_2px_10px_rgba(175,82,222,0.3)] active:scale-95"
                >
                  <Zap className="w-3.5 h-3.5" />
                  {product.isRegistered ? "Gerenciar" : "Cadastrar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
