import axios from 'axios';

function extractVideoId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

export async function getmp3(url) {
  try {
    const id = extractVideoId(url);
    if (!id) throw new Error('URL inválida o no contiene ID de video');

    let { data } = await axios.post('https://es.flvto.top/converter', {
      id,
      fileType: 'mp3'
    }, {
      headers: {
        Referer: `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
        Origin: 'https://es.flvto.top',
        'Content-Type': 'application/json',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });

    while (data.progress < 99) {
      await new Promise(r => setTimeout(r, 2000));
      const res = await axios.post('https://es.flvto.top/converter', {
        id,
        fileType: 'mp3'
      }, {
        headers: {
          Referer: `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
          Origin: 'https://es.flvto.top',
          'Content-Type': 'application/json',
          'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
        }
      });
      data = res.data;
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title: data.title,
        filesize: data.filesize,
        duration: data.duration,
        link: data.link
      }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error desconocido' }
    };
  }
}

export async function getmp4(url) {
  try {
    const id = extractVideoId(url);
    if (!id) throw new Error('URL inválida o no contiene ID de video');

    const { data } = await axios.post('https://es.flvto.top/converter', {
      id,
      fileType: 'mp4'
    }, {
      headers: {
        Referer: `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
        Origin: 'https://es.flvto.top',
        'Content-Type': 'application/json',
        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
      }
    });

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title: data.title,
        result: data.formats[0]
      }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error desconocido' }
    };
  }
}
