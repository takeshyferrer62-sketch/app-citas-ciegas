import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, ArrowLeft } from 'lucide-react';
import { triggerHaptic } from './utils/telegram';

// ⚠️ REEMPLAZA ESTA URL CON LA DE TU BACKEND EN RENDER:
const SOCKET_URL = "https://telegram-dating-backend-ge2o.onrender.com"; 

// Inicializar la conexión de Socket.io
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

export default function ChatView({ matchId, currentUserId, recipientName, onBack }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Unirse a la sala específica de este match en el servidor
    socket.emit('join_match', matchId);

    // Escuchar los mensajes que lleguen en tiempo real
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
      triggerHaptic('light'); // Vibración háptica nativa al recibir mensaje
    });

    return () => {
      socket.off('receive_message');
    };
  }, [matchId]);

  useEffect(() => {
    // Auto-scroll hacia el último mensaje recibido
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    triggerHaptic('medium');

    const messageData = {
      matchId,
      senderId: currentUserId,
      text: inputText.trim()
    };

    // Enviar el mensaje a través de WebSockets al servidor en Render
    socket.emit('send_message', messageData);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white max-w-md mx-auto relative select-none">
      
      {/* Header del Chat */}
      <div className="flex items-center gap-3 p-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center font-bold text-white">
            {recipientName ? recipientName.charAt(0) : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-sm">{recipientName || 'Usuario'}</h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Match Mutuo 🤫
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center text-xs">
            <p>¡Es un match mutuo!</p>
            <p className="mt-1">Envía el primer mensaje secreto para romper el hielo.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender === currentUserId;
            return (
              <div 
                key={index} 
                className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
              >
                <div className={`p-3 rounded-2xl text-sm ${isMe ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input para Enviar Mensaje */}
      <form onSubmit={sendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe un mensaje secreto..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500"
        />
        <button
          type="submit"
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-600 to-violet-600 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
