import axios from 'axios';

export async function tiktok3(url) {
  if (!url || typeof url !== 'string' || !url.includes('tiktok.com')) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de TikTok." }
    };
  }

  const headers = {
    'accept': '*/*',
    'accept-language': 'en',
    'content-type': 'application/json',
    'g-footer': '1fa90cd16845ab55424f3a13641c4c19',
    'g-timestamp': '1747114488753',
    'origin': 'https://snapany.com',
    'priority': 'u=1, i',
    'referer': 'https://snapany.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  };

  const data = {
    "link": url
  };

  try {
    const response = await axios.post('https://api.snapany.com/v1/extract', data, { headers });
    if (!response.data || !response.data.data) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener información del video de TikTok." }
      };
    }
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: response.data.data }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
