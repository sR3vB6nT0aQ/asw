import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = 'https://music.apple.com/id/search?term=';

// Limpia el prefijo "Song · " o "Album · " del artista
function cleanSubtitle(subtitle) {
  return subtitle.replace(/^Song\s*·\s*/i, '')
                 .replace(/^Album\s*·\s*/i, '')
                 .trim();
}

async function fetchAppleMusicTracks(query, limit = 5) {
  const url = `${BASE_URL}${encodeURIComponent(query)}`;
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(html);
    const results = [];

    $('li.grid-item').each((_, li) => {
      if (results.length >= limit) return false;
      const el = $(li);

      const link = el.find('a.click-action').attr('href');
      const title = el.find('[data-testid="top-search-result-title"] .top-search-lockup__primary__title').text().trim();
      let subtitle = el.find('[data-testid="top-search-result-subtitle"]').text().trim();
      subtitle = cleanSubtitle(subtitle);

      const imgSrc = el.find('picture source[type="image/jpeg"]').first().attr('srcset')?.split(' ')[0] || null;

      if (title && link) {
        results.push({
          id: link.split('/').pop(),
          titulo: title,
          artista: subtitle,
          url: link,
          thumbnail: imgSrc,
          duracion: 'N/A'
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Error en buscarAppleMusic:', error);
    return [];
  }
}

export async function appleMusicSearch(query) {
  const tracks = await fetchAppleMusicTracks(query, 5);
  return {
    autor: "🜲 ᵖᵃᵗᵒ",
    status: tracks.length > 0,
    data: tracks
  };
}

export async function fappleMusicSearch(query) {
  const tracks = await fetchAppleMusicTracks(query, 50);
  return {
    autor: "🜲 ᵖᵃᵗᵒ",
    status: tracks.length > 0,
    data: tracks
  };
}

