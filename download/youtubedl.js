import axios from 'axios';

export async function dlyta(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de YouTube." }
    };
  }

  const apiUrl = 'https://cdn304.savetube.su/v2/info';
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://ytmp3.at',
    'priority': 'u=1, i',
    'referer': 'https://ytmp3.at/',
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
  };

  const data = { url };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    if (!response.data) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener la información del video." }
      };
    }
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: response.data }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
