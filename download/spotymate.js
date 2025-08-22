import axios from 'axios';

export async function downloadFromSpotymate(trackUrl) {
  try {
    const res = await axios.post('https://spotymate.com/api/download-track', { url: trackUrl }, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.data.file_url) {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    }
    return { autor: '🜲 ᵖᵃᵗᵒ', status: true, data: { file_url: res.data.file_url } };
  } catch (e) {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  }
}
