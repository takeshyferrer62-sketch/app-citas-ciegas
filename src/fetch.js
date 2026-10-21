// Ejemplo de llamada a tu backend desplegado
const handleLike = async (senderId, receiverId) => {
  try {
    const response = await fetch(`${API_URL}/api/matches/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId,
        receiverId,
        type: 'like'
      })
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error al enviar like:", error);
  }
};