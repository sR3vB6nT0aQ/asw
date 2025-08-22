import axios from 'axios';

export async function yttranscript(idyt) {
  if (!idyt || typeof idyt !== 'string' || !idyt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar la URL del video de YouTube." }
    };
  }

  try {
    const url = 'https://api.kome.ai/api/tools/youtube-transcripts';
    const data = {
      video_id: idyt,
      format: true
    };

    const res = await axios.post(url, data, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(100 + Math.random() * 30)}.0.0.0 Safari/537.36`,
        'Referer': 'https://kome.ai/tools/youtube-transcript-generator'
      }
    });

    const json = res.data;
    if (!json || !json.transcript) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "El video no tiene transcripción." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: json.transcript }
    };

  } catch (error) {
    console.error(error);
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Error al obtener la transcripción." }
    };
  }
}
