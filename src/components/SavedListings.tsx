import React, { useState } from "react";
import { 
  Bookmark, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Tag, 
  Calendar,
  Layers,
  FileText
} from "lucide-react";
import { SavedListing } from "../types";

interface SavedListingsProps {
  savedListings: SavedListing[];
  onDeleteListing: (id: string) => void;
  onSelectListing: (listing: SavedListing) => void;
}

export const SavedListings: React.FC<SavedListingsProps> = ({
  savedListings,
  onDeleteListing,
  onSelectListing,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    savedListings.length > 0 ? savedListings[0].id : null
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeListing = savedListings.find((l) => l.id === selectedId) || savedListings[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadTxt = (listing: SavedListing) => {
    const content = `ANÚNCIO SALVO MERCADO LIVRE
=============================================
PRODUTO: ${listing.productName}
MARCA: ${listing.brand}
PREÇO: R$ ${listing.price.toFixed(2)}
CRIADO EM: ${listing.createdAt}

TÍTULO SELECIONADO:
${listing.selectedTitle}

OUTRAS VARIAÇÕES DE TÍTULO:
${listing.data.titles.map((t, i) => `${i + 1}. [${t.charCount}/60 chars] ${t.title}`).join("\n")}

CATEGORIA:
${listing.data.suggestedCategory}

PALAVRAS-CHAVE:
${listing.data.keywords.join(", ")}

FICHA TÉCNICA:
${listing.data.technicalAttributes.map((a) => `- ${a.name}: ${a.value}`).join("\n")}

DESCRIÇÃO COMPLETA:
${listing.data.technicalDescription}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anuncio-${listing.productName.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (savedListings.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
          <Bookmark className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Nenhum anúncio salvo ainda</h3>
        <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
          Use a aba <strong>"Criador de Anúncio"</strong> para gerar títulos de 60 caracteres, ficha técnica e descrições, e clique em "Salvar Anúncio" para guardá-los aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span>Meus Anúncios Salvos ({savedListings.length})</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Seus anúncios gerados ficam salvos neste navegador para consulta rápida
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-3">
          {savedListings.map((listing) => {
            const isSelected = activeListing?.id === listing.id;
            return (
              <div
                key={listing.id}
                onClick={() => setSelectedId(listing.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-400/10 border-amber-400 ring-1 ring-amber-400/40"
                    : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{listing.createdAt}</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold">
                      R$ {listing.price.toFixed(2)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {listing.productName}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {listing.selectedTitle}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-800/80">
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {listing.brand || "Sem marca"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteListing(listing.id);
                    }}
                    className="p-1 text-neutral-500 hover:text-rose-400 transition"
                    title="Excluir este anúncio"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail */}
        {activeListing && (
          <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-xs text-neutral-400 block">Produto Salvo:</span>
                <h3 className="text-lg font-bold text-white">{activeListing.productName}</h3>
                <span className="text-xs text-amber-400 font-semibold">
                  Preço: R$ {activeListing.price.toFixed(2)} | Categoria: {activeListing.data.suggestedCategory}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadTxt(activeListing)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg transition border border-neutral-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar TXT</span>
                </button>
              </div>
            </div>

            {/* Title display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 flex items-center space-x-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Título Principal (60 caracteres):</span>
                </span>
                <button
                  onClick={() => handleCopy(activeListing.selectedTitle, "title")}
                  className="text-xs text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === "title" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "title" ? "Copiado" : "Copiar"}</span>
                </button>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-semibold text-white">
                {activeListing.selectedTitle}
              </div>
            </div>

            {/* Ficha Técnica */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-300 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Ficha Técnica do Catálogo:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {activeListing.data.technicalAttributes.map((attr, i) => (
                  <div key={i} className="p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs">
                    <span className="text-neutral-400 block text-[10px]">{attr.name}</span>
                    <span className="text-white font-semibold">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Descrição Técnica:</span>
                </span>
                <button
                  onClick={() => handleCopy(activeListing.data.technicalDescription, "desc")}
                  className="text-xs text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  {copiedKey === "desc" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "desc" ? "Copiado" : "Copiar Descrição"}</span>
                </button>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
                {activeListing.data.technicalDescription}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
