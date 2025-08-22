import axios from 'axios';
import * as cheerio from 'cheerio';

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

export async function ytmp3(url) {
  if (!url) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "No se proporcionó URL de YouTube." }
    };
  }

  const videoId = extractVideoId(url);
  const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;

  try {
    // Primer intento con yt1s.click
    const form = new URLSearchParams();
    form.append('q', url);
    form.append('type', 'mp3');

    const res = await axios.post('https://yt1s.click/search', form.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://yt1s.click',
        'Referer': 'https://yt1s.click/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    const $ = cheerio.load(res.data);
    const link = $('a[href*="download"]').attr('href');

    if (link) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: {
          link,
          title: $('title').text().trim() || 'Unknown Title',
          thumbnail,
          source: 'yt1s.click'
        }
      };
    }
  } catch (e) {
    console.warn('Error en yt1s.click:', e.message);
  }

  try {
    // Segundo intento con ht.flvto.online
    if (!videoId) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "ID de video inválido." }
      };
    }

    const payload = {
      fileType: 'MP3',
      id: videoId
    };

    const res = await axios.post('https://ht.flvto.online/converter', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ht.flvto.online',
        'Referer': `https://ht.flvto.online/widget?url=https://www.youtube.com/watch?v=${videoId}`,
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13)',
      }
    });

    const data = res?.data;
    if (!data || typeof data !== 'object' || data.status !== 'ok' || !data.link) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: data?.msg || "Error en servicio alternativo." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        link: data.link,
        title: data.title || 'Unknown Title',
        thumbnail,
        filesize: data.filesize || 'No disponible',
        duration: data.duration || 'No disponible',
        source: 'ht.flvto.online'
      }
    };

  } catch (e) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: `Error en servicio alternativo: ${e.message}` }
    };
  }
}
