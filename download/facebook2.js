import axios from 'axios';
import cheerio from 'cheerio';

export async function fbdl2v2(url) {
  try {
    const { data } = await axios.post(
      'https://getmyfb.com/process',
      `id=${encodeURIComponent(url)}&locale=id`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://getmyfb.com/id',
        }
      }
    );

    const $ = cheerio.load(data);
    const result = {
      metadata: {
        title: $('.results-item-text').text().trim(),
        image: $('.results-item-image').attr('src'),
      },
      media: $('.results-list li a')
        .map((_, el) => $(el).attr('href'))
        .get(),
    };

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: result.media.length > 0,
      data: result
    };
  } catch (e) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: { error: e.message || e }
    };
  }
}
