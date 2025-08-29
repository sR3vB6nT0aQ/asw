import axios from 'axios';

export async function scdl1(url) {
  try {
    const { data } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?format=mp3&url=${encodeURIComponent(url)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          origin: 'https://soundcloudrips.com',
          referer: 'https://soundcloudrips.com/'
        }
      }
    );

    if (!data?.success || !data.progress_url)
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };

    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const prog = await axios.get(data.progress_url);
      if (prog.data?.success && prog.data.download_url) {
        return {
          autor: '🜲 ᵖᵃᵗᵒ',
          status: true,
          data: { url: prog.data.download_url }
        };
      }
    }
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  }
}