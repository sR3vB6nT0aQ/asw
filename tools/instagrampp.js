import axios from 'axios';

export async function igdlp(username) {
  if (!username || typeof username !== 'string' || !username.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar un usuario o enlace de perfil de Instagram válido." }
    };
  }

  try {
    const postd = `url=${encodeURIComponent(username)}&lang=en`;

    const res = await axios.post('https://api.instasave.website/dp', postd, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://instasave.website/download'
      },
      decompress: true
    });

    const imurl = res.data.match(/<img src="([^"]+)"/);
    if (imurl && imurl[1]) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: { url: imurl[1] }
      };
    }

    const ambilurl = res.data.match(/cdn\.instasave\.website[^"]+/);
    if (ambilurl) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: { url: `https://${ambilurl[0]}` }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "No se pudo obtener la foto de perfil." }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
