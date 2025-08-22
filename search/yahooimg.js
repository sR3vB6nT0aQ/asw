import axios from 'axios';
import https from 'https';
import cheerio from 'cheerio';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const body = {
  httpsAgent,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
  }
};

export async function yahooimg(query) {
  try {
    const res = await axios.get('https://images.search.yahoo.com/search/images?p=' + encodeURIComponent(query), body);
    const $ = cheerio.load(res.data);
    const items = [];

    $('.sres-cntr li').each((_, el) => {
      const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      if (img) items.push({ image: img.split('&')[0] });
    });

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: items.length > 0,
      data: items
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error al buscar imágenes' }
    };
  }
}
