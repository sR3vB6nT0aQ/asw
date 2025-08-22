import axios from 'axios';

const ytdown = {
  api: {
    base: "https://p.oceansaver.in/ajax/",
    progress: "https://p.oceansaver.in/ajax/progress.php"
  },
  headers: {
    'authority': 'p.oceansaver.in',
    'origin': 'https://y2down.cc',
    'referer': 'https://y2down.cc/',
    'user-agent': 'Postify/1.0.0'
  },
  formats: [
    '360', '480', '720', '1080', '1440', '2160',
    'mp3', 'm4a', 'wav', 'aac', 'flac', 'opus', 'ogg'
  ],
  isUrl: str => {
    try { new URL(str); return true; } catch { return false; }
  },
  youtube: url => {
    if (!url) return null;
    const regex = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let b of regex) if (b.test(url)) return url.match(b)[1];
    return null;
  },
  request: async (endpoint, params = {}) => {
    try {
      const { data } = await axios.get(`${ytdown.api.base}${endpoint}`, {
        params, headers: ytdown.headers, withCredentials: true
      });
      return data;
    } catch {
      return null;
    }
  },
  download: async (link, format) => {
    if (!link || !ytdown.isUrl(link) || !format || !ytdown.formats.includes(format)) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const id = ytdown.youtube(link);
    if (!id) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const response = await ytdown.request("download.php", { format, url: `https://www.youtube.com/watch?v=${id}` });
    if (!response?.success || !response.id) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const pr = await ytdown.checkProgress(response.id);
    if (!pr.success) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        title: response.title || "Desconocido",
        type: ['360', '480', '720', '1080', '1440', '2160'].includes(format) ? 'video' : 'audio',
        format,
        thumbnail: response.info?.image || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        download: pr.download_url || "Desconocido",
        id
      }
    };
  },
  checkProgress: async (id) => {
    let attempts = 0;
    while (attempts < 100) {
      try {
        const { data } = await axios.get(ytdown.api.progress, {
          params: { id }, headers: ytdown.headers, withCredentials: true
        });
        if (data.download_url && data.success) return { success: true, ...data };
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch {
        attempts++; await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return { success: false };
  }
};

export default ytdown;