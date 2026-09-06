import React, { useState } from "react";
import { 
  Wrench, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  MessageSquare, 
  Camera, 
  Bookmark,
  ChevronRight
} from "lucide-react";
import { FeeCalculator } from "./FeeCalculator";
import { ListingOptimizer } from "./ListingOptimizer";
import { ListingAuditor } from "./ListingAuditor";
import { QuestionAssistant } from "./QuestionAssistant";
import { PhotoGuide } from "./PhotoGuide";
import { SavedListings } from "./SavedListings";
import { SavedListing } from "../types";

interface ToolsViewProps {
  savedListings: SavedListing[];
  onDeleteSavedListing: (id: string) => void;
  onSaveListing: (listing: SavedListing) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({
  savedListings,
  onDeleteSavedListing,
  onSaveListing
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "optimizer" | "calculator" | "auditor" | "questions" | "photos" | "saved"
  >("optimizer");

  const tools = [
    { id: "optimizer", label: "Otimizador de Títulos & Ficha IA", icon: Sparkles, badge: "IA 60 chars" },
    { id: "calculator", label: "Calculadora de Taxas & Lucro Real", icon: Calculator, badge: "Taxas 2025" },
    { id: "auditor", label: "Auditor de Saúde do Anúncio", icon: ShieldCheck, badge: "SEO Score" },
    { id: "questions", label: "SAC & Respostas Pré-Venda IA", icon: MessageSquare, badge: "Conversão" },
    { id: "photos", label: "Guia de Fotos Profissionais", icon: Camera, badge: "Fundo Branco" },
    { id: "saved", label: `Anúncios Salvos (${savedListings.length})`, icon: Bookmark }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Sub Navigation Bar with Purple Highlights */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-[#121216]/80 backdrop-blur-2xl p-2 rounded-2xl border border-white/[0.08] shadow-lg">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeSubTab === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveSubTab(tool.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-2 ${
                isActive
                  ? "bg-[#af52de] text-white shadow-[0_2px_12px_rgba(175,82,222,0.35)]"
                  : "bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
              <span>{tool.label}</span>
              {tool.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                  isActive ? "bg-black/30 text-white" : "bg-black/40 text-[#d884ff] border border-[#af52de]/30"
                }`}>
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active Tool Content */}
      <div className="space-y-6">
        {activeSubTab === "optimizer" && (
          <ListingOptimizer onSaveListing={onSaveListing} />
        )}

        {activeSubTab === "calculator" && (
          <FeeCalculator />
        )}

        {activeSubTab === "auditor" && (
          <ListingAuditor />
        )}

        {activeSubTab === "questions" && (
          <QuestionAssistant />
        )}

        {activeSubTab === "photos" && (
          <PhotoGuide />
        )}

        {activeSubTab === "saved" && (
          <SavedListings
            listings={savedListings}
            onDelete={onDeleteSavedListing}
            onUseTemplate={(listing) => {
              setActiveSubTab("optimizer");
            }}
          />
        )}
      </div>
    </div>
  );
};
