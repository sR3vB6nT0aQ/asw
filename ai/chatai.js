import axios from 'axios';

export async function chatai(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El texto debe ser una cadena de texto válida." },
    };
  }

  try {
    const payload = {
      messages: [
        {
          role: "user",
          content: text,
        }
      ]
    };

    const headers = {
      headers: {
        Origin: "https://chatai.org",
        Referer: "https://chatai.org/"
      }
    };

    const { data } = await axios.post("https://chatai.org/api/chat", payload, headers);

    if (data.status === 500) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: data.data || "Error del servidor sin detalles." },
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data.content || "No se recibió respuesta del AI." },
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." },
    };
  }
}
