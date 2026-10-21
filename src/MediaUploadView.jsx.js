import React, { useState } from 'react';
import { Camera, Video, Plus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from './utils/telegram';

export default function MediaUploadView({ onNext }) {
  const [avatar, setAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
  const [shortVideo, setShortVideo] = useState(null);
  const [gallery, setGallery] = useState([
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    null,
    null
  ]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerHaptic('light');
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      triggerHaptic('medium');
      setShortVideo(file.name);
    }
  };

  const handleSaveAndContinue = () => {
    triggerHaptic('heavy');
    // Aquí enviarías el FormData con los archivos al backend de Node.js
    onNext();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto p-4 select-none justify-between">
      
      {/* Header */}
      <div>
        <div className="py-2">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Tu Perfil Oculto 📸
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sube tu mejor foto y un video corto para que otros usuarios sientan afinidad instantánea.
          </p>
        </div>

        {/* Sección de Foto de Perfil Principal */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative group">
            <img 
              src={avatar} 
              alt="Avatar principal" 
              className="w-28 h-28 rounded-full object-cover border-2 border-pink-500 shadow-xl"
            />
            <label className="absolute bottom-0 right-0 bg-pink-600 hover:bg-pink-500 text-white p-2.5 rounded-full shadow-lg cursor-pointer active:scale-95 transition-transform">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <span className="text-xs text-slate-400 mt-2 font-medium">Foto Principal</span>
        </div>

        {/* Sección de Video Corto (Estilo Telegram Story / Videomensaje) */}
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Videomensaje Corto</h3>
              <p className="text-[11px] text-slate-400">
                {shortVideo ? `✅ ${shortVideo}` : "Muestra tu voz y energía (máx. 10s)"}
              </p>
            </div>
          </div>
          <label className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold px-3.5 py-2 rounded-xl cursor-pointer border border-slate-700 active:scale-95 transition-transform">
            {shortVideo ? "Cambiar" : "Subir"}
            <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
          </label>
        </div>

        {/* Galería Secundaria (Grid de fotos) */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Galería Secundaria</h3>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((imgUrl, index) => (
              <div key={index} className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-inner">
                {imgUrl ? (
                  <>
                    <img src={imgUrl} alt={`Galeria ${index}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        const newGallery = [...gallery];
                        newGallery[index] = null;
                        setGallery(newGallery);
                      }}
                      className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 p-1 rounded-full backdrop-blur-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                    <Plus className="w-6 h-6" />
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files[0];
                      if(file) {
                        const newGallery = [...gallery];
                        newGallery[index] = URL.createObjectURL(file);
                        setGallery(newGallery);
                      }
                    }} className="hidden" />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botón de Siguiente / Guardar */}
      <div className="py-4">
        <button
          onClick={handleSaveAndContinue}
          className="w-full bg-gradient-to-r from-pink-600 to-violet-600 font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-pink-900/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Guardar y Explorar <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}