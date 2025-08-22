import axios from 'axios';

function extractVideoId(url) {
  // Regular YouTube URLs
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  let match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];

  // YouTube Shorts URLs
  regExp = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;
  match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];

  // youtu.be URLs
  regExp = /youtu.be\/([^#&?]*)/;
  match = url.match(regExp);
  if (match && match[1].length === 11) return match[1];

  return null;
}

export async function dlytv(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de YouTube." }
    };
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "URL de YouTube inválida." }
    };
  }

  const apiUrl = "https://ac.insvid.com/converter";
  const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "application/json",
    "origin": "https://ac.insvid.com",
    "priority": "u=1, i",
    "referer": `https://ac.insvid.com/widget?url=https://www.youtube.com/watch?v=${videoId}&el=416`,
    "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "sec-fetch-storage-access": "active",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
  };
  const data = {
    "id": videoId,
    "fileType": "mp4"
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });

    if (!response.data || !response.data.success) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el video. Intenta con otro enlace." }
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
