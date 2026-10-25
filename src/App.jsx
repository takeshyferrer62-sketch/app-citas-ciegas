import React, { useEffect, useState } from 'react';
import { getTelegramUser, initTelegramWebApp } from './config/telegram';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    initTelegramWebApp();
    const tgUser = getTelegramUser();
    if (tgUser) {
      setUser(tgUser);
    }
  }, []);

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>App Citas Ciegas - Admin</h1>
      {user ? (
        <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px', margin: '20px auto', maxWidth: '400px' }}>
          <p>¡Hola, <strong>{user.first_name}</strong>!</p>
          <p>ID de Telegram: {user.id}</p>
        </div>
      ) : (
        <p>Ejecutándose en entorno web o fuera de Telegram WebApp.</p>
      )}
      <p style={{ color: '#666' }}>Panel de administración y gestión de citas configurado correctamente.</p>
    </div>
  );
}

export default App;
