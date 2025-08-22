import fetch from "node-fetch";
import translate from '@vitalets/google-translate-api';

export async function doppleAi(prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El prompt debe ser una cadena de texto válida." }
    };
  }

  const url = "https://beta.dopple.ai/api/messages/send";
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36",
    Referer: "https://beta.dopple.ai/messages",
  };
  const body = JSON.stringify({
    streamMode: "none",
    chatId: "632cef078c294913b5b4653869eca845",
    folder: "",
    images: false,
    username: "PatO-Awx",
    persona_name: "",
    id: "46db0561-cb3e-43d9-8f50-40b3e3c84713",
    userQuery: prompt,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body
    });
    const data = await response.json();

    if (!data.response) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta de Dopple AI." }
      };
    }

    // Traducir la respuesta al español
    try {
      const translated = await translate(data.response, { to: 'es' });
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: { result: translated.text }
      };
    } catch (translateError) {
      // Si falla la traducción, devolver texto original
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: { result: data.response }
      };
    }

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
