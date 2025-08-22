import axios from 'axios';
import cheerio from 'cheerio';

export async function pindl2(url) {
  try {
    const { data } = await axios.get(
      `https://www.savepin.app/download.php?url=${encodeURIComponent(url)}&lang=en&type=redirect`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://www.savepin.app/'
        }
      }
    );

    const $ = cheerio.load(data);
    const results = [];

    const table = $('table').has('tr:contains("Quality"), tr:contains("480p")').first();

    table.find('tr').each((_, el) => {
      const quality = $(el).find('.video-quality').text().trim();
      const format = $(el).find('td:nth-child(2)').text().trim();
      const link = $(el).find('a').attr('href');
      if (quality && link) {
        results.push({
          quality,
          format,
          media: link.startsWith('http') ? link : 'https://www.savepin.app' + (link.startsWith('/') ? link : '/' + link)
        });
      }
    });

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: results.length > 0,
      data: results
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: []
    };
  }
}