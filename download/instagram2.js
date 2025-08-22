import axios from 'axios';
import cheerio from 'cheerio';

async function downloadGram(urlInsta) {
  const payload = new URLSearchParams();
  payload.append('url', urlInsta);
  payload.append('v', '3');
  payload.append('lang', 'id');

  const config = {
    method: 'POST',
    url: 'https://api.downloadgram.org/media',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    data: payload.toString()
  };

  try {
    const response = await axios(config);
    const $ = cheerio.load(response.data);
    const media = [];

    $('video source[src], img[src]').each((_, element) => {
      const $el = $(element);
      const url = $el.attr('src');
      if (url) {
        const cleanUrl = url.replace(/^"|"$/g, '').trim();
        media.push(cleanUrl);
      }
    });

    return {
      author: '🜲 ᵖᵃᵗᵒ',
      status: media.length > 0,
      data: {
        media
      }
    };
  } catch (error) {
    return {
      author: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: {
        media: [],
        error: error.message
      }
    };
  }
}

export default downloadGram;