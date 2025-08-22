import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export async function googleimg(query) {
  try {
    const res = await fetch(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const pattern = /\[1,\[0,"(?<id>[\d\w\-_]+)",\["https?:\/\/(?:[^"]+)",\d+,\d+\]\s?,\["(?<url>https?:\/\/(?:[^"]+))",\d+,\d+\]/gm;
    const matches = html.matchAll(pattern);

    const images = [...matches]
      .map(({ groups }) => decodeURIComponent(JSON.parse(`"${groups?.url}"`)))
      .filter(url => /\.(jpe?g|png)$/i.test(url));

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: images.length > 0,
      data: images
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error buscando imágenes en Google' }
    };
  }
}
