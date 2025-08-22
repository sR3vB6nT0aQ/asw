import axios from 'axios';

export async function tiktok(url) {
  try {
    const domain = 'https://www.tikwm.com/api/';
    const res = await axios.post(domain, {}, {
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://www.tikwm.com',
        'Referer': 'https://www.tikwm.com/',
        'Sec-Ch-Ua': '"Not)A;Brand" ;v="24" , "Chromium" ;v="116"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': 'Android',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      },
      params: {
        url: url,
        hd: 1
      }
    });

    if (!res.data.data) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { message: 'Respuesta inválida' }
      };
    }

    const data = res.data.data;
    if (!data.size && !data.wm_size && !data.hd_size) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: data.images.map(v => ({ type: 'photo', url: v }))
      };
    } else {
      const videos = [];
      if (data.wmplay) videos.push({ type: 'watermark', url: data.wmplay });
      if (data.play) videos.push({ type: 'nowatermark', url: data.play });
      if (data.hdplay) videos.push({ type: 'nowatermark_hd', url: data.hdplay });
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: videos
      };
    }
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { message: 'Error al obtener datos', error: error.message }
    };
  }
}
