import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

export async function twitter2(url) {
  try {
    const tokenRes = await axios.post('https://x2twitter.com/api/userverify', 'url=' + url);
    const data = qs.stringify({
      q: url,
      lang: 'en',
      cftoken: tokenRes.data.token
    });

    const html = await axios.post('https://x2twitter.com/api/ajaxSearch', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const $ = cheerio.load(html.data.data);
    let videoUrl = null;
    $('.dl-action a').each((_, el) => {
      const quality = $(el).text().trim();
      if (quality.includes('Download MP4') && !videoUrl) {
        videoUrl = $(el).attr('href');
      }
    });

    if (!videoUrl) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {}
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        video: videoUrl
      }
    };
  } catch {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: {}
    };
  }
}
