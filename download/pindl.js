import axios from 'axios';
import cheerio from 'cheerio';

export async function pindl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36",
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    const $ = cheerio.load(response.data);
    const leafSnippet = $('script[data-test-id="leaf-snippet"]').text();
    const videoSnippet = $('script[data-test-id="video-snippet"]').text();

    if (!leafSnippet) {
      return {
        autor: '🜲 ᵖᵃᵗᵒ',
        status: false,
        data: {}
      };
    }

    const info = JSON.parse(leafSnippet);
    const videoInfo = videoSnippet ? JSON.parse(videoSnippet) : null;

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        isVideo: !!videoSnippet,
        info,
        image: info.image,
        video: videoInfo ? videoInfo.contentUrl : ''
      }
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: {}
    };
  }
}