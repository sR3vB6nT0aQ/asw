import axios from 'axios';
import FormData from 'form-data';

async function ytdl(url, reqFormat = 'best') {
  try {
    const form = new FormData();
    form.append('url', url);

    const headers = {
      ...form.getHeaders(),
      origin: 'https://www.videodowns.com',
      referer: 'https://www.videodowns.com/youtube-video-downloader.php',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
    };

    const { data } = await axios.post(
      'https://www.videodowns.com/youtube-video-downloader.php?action=get_info',
      form,
      { headers }
    );

    if (!data.success || !data.formats) throw new Error('❌ Falló al obtener datos del video.');

    const formats = data.formats;
    const formatMap = {
      best: 'best',
      '720p': 'medium',
      '480p': 'low',
      mp3: 'audio'
    };

    const selectedKey = formatMap[reqFormat.toLowerCase()] || 'best';
    const selected = formats[selectedKey];

    if (!selected || !selected.ext) throw new Error(`❌ Formato "${reqFormat}" no disponible.`);

    const info = data.info;
    const title = info.title || 'Video';
    const downloadURL = `https://www.videodowns.com/youtube-video-downloader.php?download=1&url=${encodeURIComponent(url)}&format=${selectedKey}`;

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title,
        thumbnail: data.thumbnail,
        format: selectedKey,
        ext: selected.ext || 'mp4',
        url: downloadURL,
        allFormats: formats,
        channel: info.channel || info.author || 'Desconocido',
        views: info.view_count || 0
      }
    };
  } catch (err) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: err?.message || err || 'Error desconocido' }
    };
  }
}

export async function audown(url) {
  return ytdl(url, 'mp3');
}

export async function vidown(url) {
  return ytdl(url, '480p');
}
