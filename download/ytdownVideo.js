import axios from 'axios';

const ytdownVideo = {
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
  formats: ['360', '480', '720', '1080', '1440', '2160', 'mp3', 'm4a', 'wav', 'aac', 'flac', 'opus', 'ogg'],
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
      const { data } = await axios.get(`${ytdownVideo.api.base}${endpoint}`, {
        params, headers: ytdownVideo.headers, withCredentials: true
      });
      return data;
    } catch {
      return null;
    }
  },
  download: async (link, format) => {
    if (!link || !ytdownVideo.isUrl(link) || !format || !ytdownVideo.formats.includes(format)) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const id = ytdownVideo.youtube(link);
    if (!id) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const response = await ytdownVideo.request("download.php", { format, url: `https://www.youtube.com/watch?v=${id}` });
    if (!response?.success || !response.id) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    const pr = await ytdownVideo.checkProgress(response.id);
    if (!pr.success) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        title: response.title || "Desconocido",
        type: ['360', '480', '720', '1080', '1440', '2160'].includes(format) ? 'video' : 'audio',
        formats: format,
        thumbnail: response.info?.image || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        download: pr.download_url || "Desconocido",
        id,
        size: pr.size || 0
      }
    };
  },
  checkProgress: async (id) => {
    let attempts = 0, lastProgress = -1;
    while (attempts < 100) {
      try {
        const { data } = await axios.get(ytdownVideo.api.progress, {
          params: { id }, headers: ytdownVideo.headers, withCredentials: true
        });
        const currentProgress = Math.round(data.progress / 10);
        if (currentProgress !== lastProgress) {
          ytdownVideo.updateBar(currentProgress);
          lastProgress = currentProgress;
        }
        if (data.download_url && data.success) return { success: true, ...data };
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } catch {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return { success: false };
  },
  updateBar: (progress) => {
    const barLength = 30;
    const filledLength = Math.round(barLength * progress / 100);
    const bar = '█'.repeat(filledLength) + ' '.repeat(barLength - filledLength);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`📥 • Progress: [${bar}] ${progress}%\n\n`);
  }
};

export default ytdownVideo;