import fetch from 'node-fetch';

export async function pollinations(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El texto debe ser una cadena de texto válida." }
    };
  }

  try {
    const url = 'https://text.pollinations.ai/openai';
    const data = {
      messages: [
        {
          role: "user",
          content: text
        }
      ],
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      'user-agent': 'Mozilla/5.0 (Linux; Android 14; NX769J Build/UKQ1.230917.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36'
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });

    const json = await response.json();
    const respuesta = json?.choices?.[0]?.message?.content;

    if (!respuesta) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta de Pollinations." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: respuesta }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
