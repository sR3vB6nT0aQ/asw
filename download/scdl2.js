import axios from 'axios';
import qs from 'qs';

export async function scdl2(url) {
  try {
    const postData = qs.stringify({
      action: 'get_soundcloud_data',
      link: url,
      page: '1'
    });

    const { data } = await axios.post(
      'https://thescdown.com/wp-admin/admin-ajax.php',
      postData,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          origin: 'https://thescdown.com',
          referer: 'https://thescdown.com/download/',
          'x-requested-with': 'XMLHttpRequest'
        }
      }
    );

    if (!data?.success || !data.data?.data?.[0]?.id)
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };

    const id = data.data.data[0].id;
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: { url: `https://thescdown.com/wp-admin/admin-ajax.php?action=download_soundcloud_track&id=${id}` }
    };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  }
}