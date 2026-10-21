import React, { useState, useEffect } from 'react';
import { Heart, X, MessageSquareHeart, Star, MapPin } from 'lucide-react';
import { initTelegramApp, triggerHaptic } from './config/telegram';
import ChatView from './ChatView';
import MatchesView from './MatchesView';
import MediaUploadView from './MediaUploadView';

const MOCK_PROFILES = [
  {
    id: 1,
    name: "Sofía Martínez",
    age: 24,
    bio: "Amante del café de especialidad, los videojuegos indies y las caminatas nocturnas.",
    location: "A 3 km de ti",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    isPremium: true,
    tags: ["Café", "Gaming", "Música Indie", "Cine"]
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    age: 27,
    bio: "Diseñador UX/UI y fotógrafo aficionado. Buscando buenas charlas.",
    location: "A 5 km de ti",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    isPremium: false,
    tags: ["Diseño", "Fotografía", "Sci-Fi"]
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('swipe'); // 'swipe', 'chat', 'matches', 'media'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Datos para el chat activo
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [activeRecipientName, setActiveRecipientName] = useState('');

  const myAccount = { isPremium: false, id: "my_user_id_123" };

  useEffect(() => {
    initTelegramApp();
  }, []);

  const currentProfile = MOCK_PROFILES[currentIndex];

  const handlePass = () => {
    triggerHaptic('medium');
    nextProfile();
  };

  const handleLike = () => {
    triggerHaptic('heavy');
    setNotification("¡Le has dado Like!");
    setTimeout(() => setNotification(null), 2000);
    nextProfile();
  };

  const handleSmsLikeClick = () => {
    triggerHaptic('heavy');
    if (currentProfile.isPremium && !myAccount.isPremium) {
      setNotification("⚠️ Este perfil es Premium. Tu cuenta requiere estatus prémium para enviar Likes con SMS.");
      return;
    }
    setShowSmsModal(true);
  };

  const sendSmsLikeSubmit = () => {
    triggerHaptic('heavy');
    setShowSmsModal(false);
    setSmsText('');
    setNotification("💌 ¡Like con SMS enviado con éxito!");
    setTimeout(() => setNotification(null), 2500);
    nextProfile();
  };

  const nextProfile = () => {
    if (currentIndex < MOCK_PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Navegación entre vistas
  if (currentView === 'media') {
    return <MediaUploadView onNext={() => setCurrentView('swipe')} />;
  }

  if (currentView === 'matches') {
    return (
      <MatchesView 
        currentUserId={myAccount.id} 
        onSelectMatch={(matchId, name) => {
          setActiveMatchId(matchId);
          setActiveRecipientName(name);
          setCurrentView('chat');
        }}
        onBack={() => setCurrentView('swipe')}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <ChatView 
        matchId={activeMatchId} 
        currentUserId={myAccount.id} 
        recipientName={activeRecipientName} 
        onBack={() => setCurrentView('matches')} 
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-screen bg-slate-950 text-white p-4 select-none max-w-md mx-auto relative overflow-hidden">
      
      {notification && (
        <div className="absolute top-4 z-50 bg-slate-800 border border-slate-700 text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="w-full flex items-center justify-between py-2 px-2">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          CitasOcultas 🤫
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentView('media')}
            className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-pink-400"
          >
            Mi Perfil 📸
          </button>
          <button 
            onClick={() => setCurrentView('matches')}
            className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-violet-400"
          >
            Matches 💬
          </button>
        </div>
      </div>

      {/* Tarjeta */}
      <div className="w-full flex-1 my-3 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img src={currentProfile.image} alt={currentProfile.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {currentProfile.isPremium && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500/90 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-current" /> Premium
          </div>
        )}

        <div className="relative z-10 p-5 flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold">{currentProfile.name},</h2>
            <span className="text-xl font-light text-slate-300">{currentProfile.age}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-pink-500" />
            <span>{currentProfile.location}</span>
          </div>

          <p className="text-sm text-slate-200 line-clamp-3 mt-1 leading-relaxed">
            {currentProfile.bio}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {currentProfile.tags.map((tag, idx) => (
              <span key={idx} className="bg-white/10 text-xs px-2.5 py-1 rounded-full text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="w-full py-3 flex items-center justify-around gap-4 px-2">
        <button onClick={handlePass} className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500 shadow-lg active:scale-95">
          <X className="w-6 h-6" />
        </button>
        <button onClick={handleSmsLikeClick} className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-lg active:scale-95">
          <MessageSquareHeart className="w-5 h-5" />
        </button>
        <button onClick={handleLike} className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xl active:scale-95">
          <Heart className="w-7 h-7 fill-current" />
        </button>
      </div>

      {showSmsModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquareHeart className="text-pink-500 w-5 h-5" /> Enviar Like con SMS
              </h3>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              rows="3"
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              placeholder="Escribe algo atractivo..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500 resize-none"
            />
            <button
              onClick={sendSmsLikeSubmit}
              disabled={!smsText.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-violet-600 font-semibold py-3 rounded-xl text-sm shadow-lg disabled:opacity-50 active:scale-95"
            >
              Enviar Mensaje y Like 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
}