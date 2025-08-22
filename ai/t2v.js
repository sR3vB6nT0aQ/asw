import axios from 'axios';

export async function t2v(prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El prompt debe ser una cadena de texto válida." }
    };
  }

  const headers = {
    authorization: 'eyJzdWIiwsdeOiIyMzQyZmczNHJ0MzR0weMzQiLCJuYW1lIjorwiSm9objMdf0NTM0NT',
    'content-type': 'application/json; charset=utf-8',
    'accept-encoding': 'gzip',
    'user-agent': 'okhttp/4.11.0'
  };

  try {
    const deviceID = Math.random().toString(16).substr(2, 8) + Math.random().toString(16).substr(2, 8);

    const { data: k } = await axios.post(
      'https://soli.aritek.app/txt2videov3',
      {
        deviceID,
        prompt,
        used: [],
        versionCode: 51
      },
      { headers }
    );

    const { data } = await axios.post(
      'https://soli.aritek.app/video',
      { keys: [k.key] },
      { headers }
    );

    if (!data?.datas?.[0]?.url) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió URL del video." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data.datas[0].url }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
