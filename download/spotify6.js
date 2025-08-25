import axios from 'axios';
import qs from 'qs';

export async function spotifyDL(url, nonce = '41dd03eeaf') {
  try {
    const payload = qs.stringify({
      action: 'spotify_downloader_get_info',
      url,
      nonce
    });

    const { data: res } = await axios.post(
      'https://spotify.downloaderize.com/wp-admin/admin-ajax.php',
      payload,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 13; moto g play - 2023 Build/T3SGS33.165-46-3-1-22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.7258.94 Mobile Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-requested-with': 'XMLHttpRequest',
          origin: 'https://spotify.downloaderize.com',
          referer: 'https://spotify.downloaderize.com/'
        }
      }
    );

    if (!res.success) throw new Error('Request failed');

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: res.data
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error desconocido.' }
    };
  }
}