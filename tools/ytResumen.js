import axios from 'axios';

export async function ytResumen(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "La URL debe ser una cadena de texto válida." }
    };
  }

  try {
    const response = await axios.get('https://yts.kooska.xyz/', {
      params: { url },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://kooska.xyz/'
      }
    });

    const res = response.data;

    if (!res || !res.ai_response) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió resumen del video." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        video_id: res.video_id,
        summarize: res.ai_response,
        transcript: res.transcript
      }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
