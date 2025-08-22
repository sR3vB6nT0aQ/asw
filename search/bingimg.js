import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function bingimg(query) {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const results = [];
    $('a.iusc').each((_, el) => {
      const meta = $(el).attr('m');
      if (meta) {
        try {
          const obj = JSON.parse(meta);
          if (obj?.murl) results.push(obj.murl);
        } catch {}
      }
    });

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: results.length > 0,
      data: results
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error buscando imágenes en Bing' }
    };
  }
}
