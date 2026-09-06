import React, { useState } from "react";
import { Play, Check, Clock, X } from "lucide-react";

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  watched: boolean;
  category: "Primeiros Passos" | "Integracao";
}

const INITIAL_LESSONS: VideoLesson[] = [
  {
    id: "v1",
    title: "Como comecar no Fornecefy",
    description: "Aprenda a configurar sua conta e fazer sua primeira venda",
    duration: "5:30",
    watched: true,
    category: "Primeiros Passos"
  },
  {
    id: "v2",
    title: "Configurando Precos",
    description: "Defina sua estrategia de precificacao e margens",
    duration: "6:10",
    watched: true,
    category: "Primeiros Passos"
  },
  {
    id: "v3",
    title: "Conectando Shopee",
    description: "Passo a passo para conectar sua loja Shopee",
    duration: "8:15",
    watched: true,
    category: "Integracao"
  },
  {
    id: "v4",
    title: "Conectando Mercado Livre",
    description: "Configure sua integracao com o Mercado Livre",
    duration: "7:00",
    watched: false,
    category: "Integracao"
  },
  {
    id: "v5",
    title: "Conectando Bling ERP",
    description: "Integre seu Bling para gestao de estoque e NF-e",
    duration: "9:00",
    watched: false,
    category: "Integracao"
  }
];

export const TutorialsView: React.FC = () => {
  const [lessons, setLessons] = useState<VideoLesson[]>(INITIAL_LESSONS);
  const [playingVideo, setPlayingVideo] = useState<VideoLesson | null>(null);

  const toggleWatched = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLessons(prev => prev.map(l => l.id === id ? { ...l, watched: !l.watched } : l));
  };

  const primeirosPassos = lessons.filter(l => l.category === "Primeiros Passos");
  const integracao = lessons.filter(l => l.category === "Integracao");

  return (
    <div className="p-8 max-w-[1600px] mx-auto select-none space-y-8">
      {/* Top Banner: Video Aulas */}
      <div className="bg-[#0b101b] border border-[#182030] rounded-2xl p-7 relative overflow-hidden shadow-sm">
        {/* Subtle vertical texture lines like the image */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 32px)"
          }}
        />

        <div className="relative z-10 space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Video Aulas
          </h1>
          <p className="text-xs text-neutral-400">
            Aprenda a usar o Fornecefy com nossos tutoriais. Do basico ao avancado.
          </p>

          <div className="pt-2 flex items-center gap-4">
            {/* Progress Bar Container */}
            <div className="w-48 h-2 bg-[#172336] rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full w-[40%]" />
            </div>
            <span className="text-xs text-neutral-400 font-normal">
              4/10 (40%)
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Primeiros Passos */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Primeiros Passos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {primeirosPassos.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setPlayingVideo(lesson)}
              className="group cursor-pointer bg-[#0a0d14] border border-[#182030] hover:border-[#223048] rounded-2xl overflow-hidden transition shadow-sm flex flex-col"
            >
              {/* Video Thumbnail area with vertical stripe motif */}
              <div className="relative h-48 bg-[#090d16] flex items-center justify-center border-b border-[#182030] overflow-hidden">
                {/* Background lines texture */}
                <div 
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 16px)"
                  }}
                />

                {/* Badge Assistido (top-left) */}
                {lesson.watched && (
                  <button
                    onClick={(e) => toggleWatched(lesson.id, e)}
                    className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#0d1422]/90 border border-[#1e2a3f] rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 backdrop-blur-sm hover:bg-[#131d30] transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    <span>Assistido</span>
                  </button>
                )}

                {/* Duration Badge (top-right) */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#0d1422]/90 border border-[#1e2a3f] rounded-lg text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{lesson.duration}</span>
                </div>

                {/* Play Button Icon */}
                <div className="w-12 h-12 rounded-full bg-[#1b2434]/80 border border-white/10 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:border-[#3b82f6] transition duration-200 shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 bg-[#0a0d14] flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight group-hover:text-sky-400 transition">
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Integracao */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Integracao
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {integracao.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => setPlayingVideo(lesson)}
              className="group cursor-pointer bg-[#0a0d14] border border-[#182030] hover:border-[#223048] rounded-2xl overflow-hidden transition shadow-sm flex flex-col"
            >
              {/* Video Thumbnail area with vertical stripe motif */}
              <div className="relative h-48 bg-[#090d16] flex items-center justify-center border-b border-[#182030] overflow-hidden">
                {/* Background lines texture */}
                <div 
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 16px)"
                  }}
                />

                {/* Badge Assistido (top-left) if watched */}
                {lesson.watched && (
                  <button
                    onClick={(e) => toggleWatched(lesson.id, e)}
                    className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#0d1422]/90 border border-[#1e2a3f] rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 backdrop-blur-sm hover:bg-[#131d30] transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    <span>Assistido</span>
                  </button>
                )}

                {/* Duration Badge (top-right) */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#0d1422]/90 border border-[#1e2a3f] rounded-lg text-[11px] font-medium text-neutral-300 flex items-center gap-1.5 backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  <span>{lesson.duration}</span>
                </div>

                {/* Play Button Icon */}
                <div className="w-12 h-12 rounded-full bg-[#1b2434]/80 border border-white/10 flex items-center justify-center text-white/90 group-hover:scale-110 group-hover:bg-[#2563eb] group-hover:border-[#3b82f6] transition duration-200 shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 bg-[#0a0d14] flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white tracking-tight group-hover:text-sky-400 transition">
                    {lesson.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d111a] border border-[#1e2738] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="p-4 border-b border-[#1e2738] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-sky-400 fill-current" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {playingVideo.title}
                </h3>
              </div>
              <button 
                onClick={() => setPlayingVideo(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="aspect-video bg-[#080b12] border border-[#182030] rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
                <p className="text-xs text-neutral-400 mt-3 font-medium">
                  Reproduzindo aula ({playingVideo.duration})
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-neutral-400">
                  {playingVideo.description}
                </p>
                <button
                  onClick={() => {
                    toggleWatched(playingVideo.id, { stopPropagation: () => {} } as any);
                    setPlayingVideo(null);
                  }}
                  className="px-3.5 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-xs font-semibold transition active:scale-95"
                >
                  Marcar como assistido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
