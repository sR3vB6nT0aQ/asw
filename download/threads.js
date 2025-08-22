import axios from 'axios';

export async function threadsScraper(url) {
  try {
    const apiUrl = `https://snapthreads.net/api/download?url=${encodeURIComponent(url)}`;

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
        "Referer": "https://snapthreads.net/id",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest"
      }
    });

    if (response.data && response.data.directLink) {
      return {
        "autor": "🜲 ᵖᵃᵗᵒ",
        "status": true,
        "data": {
          download_url: response.data.directLink,
          type: response.data.directLink.includes("mp4") ? "video" : "image"
        }
      };
    } else {
      return {
        "autor": "🜲 ᵖᵃᵗᵒ",
        "status": false,
        "data": {
          message: "Error al obtener el enlace de descarga.",
          error: response.data
        }
      };
    }
  } catch (error) {
    return {
      "autor": "🜲 ᵖᵃᵗᵒ",
      "status": false,
      "data": {
        message: "Ocurrió un error al procesar la solicitud.",
        error: error.response ? error.response.data : error.message
      }
    };
  }
}
