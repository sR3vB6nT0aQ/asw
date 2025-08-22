import axios from 'axios';

const BASE      = 'https://api.cdnframe.com/api/v5';
const COMMON    = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 13; moto g play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.94 Mobile Safari/537.36',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'sec-ch-ua-platform': '"Android"',
  'sec-ch-ua': '"Not;A=Brand";v="99", "Android WebView";v="139", "Chromium";v="139"',
  'sec-ch-ua-mobile': '?1',
  'origin': 'https://clickapi.net',
  'x-requested-with': 'mark.via.gp',
  'sec-fetch-site': 'cross-site',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': 'https://clickapi.net/',
  'accept-language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7',
  'priority': 'u=1, i'
};

async function _getToken() {
  const { data } = await axios.post(`${BASE}/auth`, {}, { headers: COMMON });
  if (!data.token) throw new Error('No se pudo obtener el token.');
  return data.token;
}

export async function info(videoUrl) {
  try {
    const id = (videoUrl.match(/(?:v=|\/)([A-Za-z0-9_-]{11})/) || [])[1];
    if (!id) throw new Error('URL inválida.');

    const token = await _getToken();
    const { data } = await axios.get(`${BASE}/info/${id}`, {
      headers: { ...COMMON, Authorization: `Bearer ${token}` }
    });

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        videoId: data.videoId,
        title: data.title,
        duration: data.duration,
        formats: data.formats
      }
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: { error: error.message || 'Error al obtener la información.' }
    };
  }
}

export async function convert(audioToken) {
  try {
    const token = await _getToken();
    const { data } = await axios.post(
      `${BASE}/convert`,
      { token: audioToken },
      { headers: { ...COMMON, Authorization: `Bearer ${token}` } }
    );

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: { jobId: data.jobId }
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: { error: error.message || 'Error al crear la conversión.' }
    };
  }
}

export async function status(jobId) {
  try {
    const token = await _getToken();
    const { data } = await axios.get(`${BASE}/status/${jobId}`, {
      headers: { ...COMMON, Authorization: `Bearer ${token}` }
    });

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        jobId: data.jobId,
        status: data.status,
        progress: data.progress,
        downloadUrl: data.downloadUrl || null,
        title: data.title,
        duration: data.duration,
        step: data.step,
        stepProgress: data.step_progress
      }
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: { error: error.message || 'Error al consultar el estado.' }
    };
  }
}