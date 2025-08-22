import axios from 'axios';
import cheerio from 'cheerio';

const BASE = 'https://www.xvideos.com';
const UA   = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function xvideossearch(query, page = 0) {
  try {
    const term = encodeURIComponent(query.trim());
    const url  = `${BASE}/?k=${term}&p=${page}`;
    const { data: html } = await axios.get(url, { headers: { 'User-Agent': UA } });
    const $ = cheerio.load(html);
    const results = [];

    $('#content .thumb-block').each((_, el) => {
      const $a   = $(el).find('a[href*="/video"]');
      const slug = $a.attr('href');
      if (!slug) return;

      const id       = slug.split('/')[2];
      const titleRaw = $a.find('p').first().text().trim() || slug.split('/')[3] || id;
      const title    = titleRaw.replace(/_/g, ' ');
      const thumb    = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';

      results.push({
        id,
        title,
        url: `${BASE}${slug}`,
        thumbnail: thumb.startsWith('http') ? thumb : `https:${thumb}`
      });
    });

    return { autor: '🜲 ᵖᵃᵗᵒ', status: true, data: results };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: [] };
  }
}

export async function xvideosdl(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': UA, Referer: BASE }
    });
    const $ = cheerio.load(html);

    const title    = $('meta[property="og:title"]').attr('content')?.trim();
    const thumb    = $('meta[property="og:image"]').attr('content')?.trim();
    const duration = parseInt($('meta[property="og:duration"]').attr('content') || 0, 10);

    let hdUrl = '';
    let sdUrl = '';

    $('script').each((_, el) => {
      const txt = $(el).html() || '';
      const m1  = txt.match(/html5player\.setVideoUrlHigh\('([^']+)'/);
      const m2  = txt.match(/html5player\.setVideoUrlLow\('([^']+)'/);
      if (m1) hdUrl = m1[1];
      if (m2) sdUrl = m2[1];
    });

    if (!hdUrl && !sdUrl) throw new Error('No se encontraron URLs de descarga');

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: { title, duration, thumbnail: thumb, hdUrl, sdUrl }
    };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  }
}