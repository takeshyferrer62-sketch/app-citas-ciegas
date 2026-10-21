import React from 'react';
import { MessageCircle, Heart, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from './config/telegram';

export default function MatchesView({ onSelectMatch, onBack }) {
  const matches = [
    {
      matchId: "match_1",
      recipient: { name: "Sofía Martínez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", isPremium: true },
      lastMessage: "¡Hola! Me encantó tu perfil 🤫",
      lastActivity: "Hace 5 min"
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto p-4 select-none">
      <div className="flex items-center gap-3 py-2 mb-4">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold flex items-center gap-2">
            <Heart className="text-pink-500 fill-current w-5 h-5" /> Tus Matches
          </h1>
          <p className="text-[11px] text-slate-400">Conversaciones desbloqueadas.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {matches.map((item) => (
          <div
            key={item.matchId}
            onClick={() => {
              triggerHaptic('light');
              onSelectMatch(item.matchId, item.recipient.name);
            }}
            className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl active:scale-[0.98] cursor-pointer"
          >
            <div className="relative">
              <img src={item.recipient.avatar} alt={item.recipient.name} className="w-14 h-14 rounded-full object-cover border-2 border-pink-500/40" />
              {item.recipient.isPremium && (
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow">
                  <Star className="w-3 h-3 fill-current" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm truncate">{item.recipient.name}</h3>
                <span className="text-[10px] text-slate-500">{item.lastActivity}</span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-1">{item.lastMessage}</p>
            </div>
            <div className="text-pink-500 p-2">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
