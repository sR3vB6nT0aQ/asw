import axios from 'axios';

export async function tiktok2(url) {
  if (!url || typeof url !== 'string' || !url.includes('tiktok.com')) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de TikTok." }
    };
  }

  try {
    const { data } = await axios.post(
      'https://downloader.bot/api/tiktok/info',
      { url },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const result = data?.data;
    if (!result || (!result.mp4 && !result.mp3)) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el video/audio de TikTok." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        video: result.mp4,
        audio: result.mp3,
        thumb: result.cover || null,
        desc: result.desc || null,
        author: result.author || null
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
