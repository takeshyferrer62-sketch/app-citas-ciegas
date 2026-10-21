import React, { useState, useEffect } from 'react';
import { Heart, X, MessageSquareHeart, Star, MapPin, ShieldAlert } from 'lucide-react';
import { initTelegramApp, triggerHaptic } from './utils/telegram';

// Perfiles de prueba iniciales
const MOCK_PROFILES = [
  {
    id: 1,
    name: "Sofía Martínez",
    age: 24,
    bio: "Amante del café de especialidad, los videojuegos indies y las caminatas nocturnas por la ciudad. Buscando a alguien con quien compartir charlas interesantes.",
    location: "A 3 km de ti",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    isPremium: true, // Este usuario tiene suscripción Premium
    tags: ["Café", "Gaming", "Música Indie", "Cine"]
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    age: 27,
    bio: "Diseñador UX/UI y fotógrafo aficionado. Si me recomiendas una buena serie de ciencia ficción, ya tienes puntos extra.",
    location: "A 5 km de ti",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    isPremium: false, // Usuario normal
    tags: ["Diseño", "Fotografía", "Sci-Fi", "Viajes"]
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [notification, setNotification] = useState(null);

  // Simulación de nuestro propio usuario (Imaginemos que somos cuenta NORMAL)
  const myAccount = { isPremium: false };

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
    // Aplicando tu regla de negocio:
    // "Si un usuario tiene una suscripción premium y otro desea enviarle un like con sms pero el emisor es normal -> Imposible"
    if (currentProfile.isPremium && !myAccount.isPremium) {
      setNotification("⚠️ Este perfil es Premium. Tu cuenta actual no puede enviarle un Like con SMS (requiere suscripción o nivel compatible).");
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
      setCurrentIndex(0); // Reiniciar loop para pruebas
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-6">
        <h2 className="text-xl font-bold mb-2">No hay más perfiles cerca</h2>
        <p className="text-slate-400 text-center">Vuelve más tarde para descubrir nuevas personas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-950 text-white p-4 select-none max-w-md mx-auto relative overflow-hidden">
      
      {/* Notificación flotante tipo Toast */}
      {notification && (
        <div className="absolute top-4 z-50 bg-slate-800 border border-slate-700 text-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <span>{notification}</span>
        </div>
      )}

      {/* Header de la App */}
      <div className="w-full flex items-center justify-between py-2 px-2">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          CitasOcultas 🤫
        </h1>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Modo Seguro
        </div>
      </div>

      {/* Tarjeta de Perfil Principal */}
      <div className="w-full flex-1 my-3 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-end">
        
        {/* Imagen de Fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={currentProfile.image} 
            alt={currentProfile.name} 
            className="w-full h-full object-cover"
          />
          {/* Gradiente oscuro para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        {/* Indicador de Badge Premium en la Tarjeta */}
        {currentProfile.isPremium && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-current" /> Premium
          </div>
        )}

        {/* Información del Perfil */}
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

          {/* Tags de Intereses */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {currentProfile.tags.map((tag, idx) => (
              <span key={idx} className="bg-white/10 backdrop-blur-md text-xs px-2.5 py-1 rounded-full text-slate-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de Acción (Swipe Controls) */}
      <div className="w-full py-3 flex items-center justify-around gap-4 px-2">
        {/* Botón Pasar / No me gusta */}
        <button 
          onClick={handlePass}
          className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-rose-500 shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
          title="Pasar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Botón Like con SMS (Lógica de suscripción integrada) */}
        <button 
          onClick={handleSmsLikeClick}
          className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-lg active:scale-95 transition-transform hover:bg-slate-800"
          title="Like con SMS"
        >
          <MessageSquareHeart className="w-5 h-5" />
        </button>

        {/* Botón Like Estándar */}
        <button 
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-900/30 active:scale-95 transition-transform"
          title="Me gusta"
        >
          <Heart className="w-7 h-7 fill-current" />
        </button>
      </div>

      {/* Modal para enviar Like con SMS */}
      {showSmsModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquareHeart className="text-pink-500 w-5 h-5" /> Enviar Like con SMS
              </h3>
              <button 
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-slate-400">
              Adjunta un mensaje directo a tu Like para destacar de inmediato ante {currentProfile.name}.
            </p>

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
              className="w-full bg-gradient-to-r from-pink-600 to-violet-600 font-semibold py-3 rounded-xl text-sm shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
            >
              Enviar Mensaje y Like 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
}