import axios from 'axios';

export async function spotiDownV3(trackUrl) {
  try {
    const res = await axios.post(
      "https://spotydown.media/api/download-track",
      { url: trackUrl },
      { headers: { "Content-Type": "application/json" } }
    );
    if (!res.data.file_url) throw new Error("No se pudo obtener el link de descarga.");
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        file_url: res.data.file_url
      }
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: {}
    };
  }
}