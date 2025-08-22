import axios from 'axios';
import cheerio from 'cheerio';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function xnxxsearch(query, page = 0) {
  try {
    const term = encodeURIComponent(query.trim().replace(/\s+/g, ' '));
    const url = `https://www.xnxx.es/search/${term}/${page}`;
    const { data: html } = await axios.get(url, { headers: { 'User-Agent': UA } });
    const $ = cheerio.load(html);
    const results = [];

    $('.thumb-block').each((_, el) => {
      const $a = $(el).find('a[href*="/video-"]');
      const slug = $a.attr('href');
      if (!slug) return;

      const videoUrl = 'https://www.xnxx.es' + slug;
      const title = slug.split('/').pop()
                        .replace(/_/g, ' ')
                        .replace(/-/g, ' ')
                        .trim();
      const thumb = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';

      results.push({ title, url: videoUrl, thumbnail: thumb });
    });

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: results
    };
  } catch {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: []
    };
  }
}

export async function xnxxdl(url) {
  try {
    const headers = {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9',
      Referer: 'https://www.xnxx.com/'
    };

    const { data: html } = await axios.get(url, { headers });
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content')?.trim();
    const thumb = $('meta[property="og:image"]').attr('content')?.trim();
    const duration = parseInt($('meta[property="og:duration"]').attr('content') || 0, 10);

    let sdUrl = '';
    let hdUrl = '';

    $('script').each((_, el) => {
      const txt = $(el).html() || '';
      const m1 = txt.match(/html5player\.setVideoUrlHigh\('([^']+)'/);
      const m2 = txt.match(/html5player\.setVideoUrlLow\('([^']+)'/);
      if (m1) hdUrl = m1[1];
      if (m2) sdUrl = m2[1];
    });

    if (!hdUrl && !sdUrl) throw new Error('No se encontraron URLs de descarga');

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: { title, duration, thumbnail: thumb, sdUrl, hdUrl }
    };
  } catch {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: {}
    };
  }
}