import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Star, Sparkles } from 'lucide-react';
import { triggerHaptic } from './utils/telegram';

export default function MatchesView({ currentUserId, onSelectMatch }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de carga de matches desde tu backend
  useEffect(() => {
    // fetch(`http://localhost:5000/api/matches/user/${currentUserId}`)
    //   .then(res => res.json())
    //   .then(data => { setMatches(data); setLoading(false); });

    // Datos mock de prueba
    setTimeout(() => {
      setMatches([
        {
          matchId: "match_abc123",
          recipient: {
            _id: "user_2",
            name: "Sofía Martínez",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
            isPremium: true
          },
          lastMessage: "¡Hola! Me encantó tu perfil 🤫",
          lastActivity: "Hace 5 min"
        },
        {
          matchId: "match_xyz789",
          recipient: {
            _id: "user_3",
            name: "Carlos Ruiz",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            isPremium: false
          },
          lastMessage: "¿Nos vemos por el centro?",
          lastActivity: "Ayer"
        }
      ]);
      setLoading(false);
    }, 500);
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-slate-400">
        Cargando tus conexiones ocultas...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto p-4 select-none">
      
      {/* Header */}
      <div className="py-2 mb-4">
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Heart className="text-pink-500 fill-current w-6 h-6" /> Tus Matches
        </h1>
        <p className="text-xs text-slate-400">Conversaciones desbloqueadas por interés mutuo.</p>
      </div>

      {/* Lista de Chats / Matches */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
            <Sparkles className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm">Aún no tienes matches mutuos. ¡Sigue dando likes!</p>
          </div>
        ) : (
          matches.map((item) => (
            <div
              key={item.matchId}
              onClick={() => {
                triggerHaptic('light');
                onSelectMatch(item.matchId, item.recipient.name);
              }}
              className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer hover:bg-slate-900"
            >
              {/* Avatar con indicador online o de premium */}
              <div className="relative">
                <img 
                  src={item.recipient.avatar} 
                  alt={item.recipient.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-pink-500/40"
                />
                {item.recipient.isPremium && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full shadow">
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                )}
              </div>

              {/* Info del Match */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm truncate">{item.recipient.name}</h3>
                  <span className="text-[10px] text-slate-500">{item.lastActivity}</span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-1">
                  {item.lastMessage}
                </p>
              </div>

              <div className="text-pink-500 p-2">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}