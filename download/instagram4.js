import axios from 'axios';

export async function igdl4(url) {
  if (!url || typeof url !== 'string' || !url.includes('instagram.com')) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de Instagram." }
    };
  }

  try {
    const response = await axios.post('https://www.fastdl.live/api/search', {
      url: url
    }, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://www.fastdl.live/'
      }
    });

    if (!response.data?.data || !response.data.data.length) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el contenido del enlace." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: response.data.data }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
