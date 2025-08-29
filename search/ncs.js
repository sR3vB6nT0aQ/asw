import axios from 'axios';
import { load } from 'cheerio';

const NCS = 'https://ncs.io';

const decorate = (d) => ({ autor: '🜲 ᵖᵃᵗᵒ', status: d.length > 0, data: d });

export async function searchncs(query) {
  try {
    const { data: html } = await axios.get(
      `${NCS}/music-search?q=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13)' } }
    );
    const $ = load(html);
    const tracks = [];

    $('tbody tr').each((_, row) => {
      const $row = $(row);
      const playBtn = $row.find('.player-play');

      tracks.push({
        title: playBtn.attr('data-track')?.trim(),
        artists: playBtn.attr('data-artistraw')?.split(',').map(a => a.trim()) || [],
        cover: playBtn.attr('data-cover'),
        genre: playBtn.attr('data-genre') || '',
        mood: $row.find('.tag').map((_, el) => $(el).text().trim()).get(),
        release: $row.find('td').eq(4).text().trim(),
        pageUrl: NCS + $row.find('a[href^="/"]').first().attr('href')
      });
    });
    return decorate(tracks);
  } catch {
    return decorate([]);
  }
}

export async function featuredncs() {
  try {
    const { data: html } = await axios.get(NCS, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13)' }
    });
    const $ = load(html);
    const tracks = [];

    $('.featured-tracks .item').each((_, el) => {
      const $el = $(el);
      const playBtn = $el.find('.player-play');

      tracks.push({
        title: playBtn.attr('data-track'),
        artists: playBtn.attr('data-artistraw')?.split(',').map(a => a.trim()) || [],
        cover: playBtn.attr('data-cover'),
        genre: playBtn.attr('data-genre') || '',
        mood: [playBtn.attr('data-versions')].filter(Boolean),
        release: $el.find('.options p').attr('title')
                   ? new Date($el.find('.options p').attr('title')).toISOString().split('T')[0]
                   : '',
        pageUrl: NCS + $el.find('a[href^="/"]').first().attr('href')
      });
    });
    return decorate(tracks);
  } catch {
    return decorate([]);
  }
}

export async function ncsDownload(trackPage) {
  try {
    const { data: html } = await axios.get(trackPage, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13)' }
    });
    const $ = load(html);

    const title  = $('h2').first().contents().first().text().trim();
    const artist = $('h2 span a').map((_, a) => $(a).text().trim()).get().join(', ');
    const downloadPath = $('.buttons a[href^="/track/download/"]').attr('href');
    const downloadUrl  = downloadPath ? NCS + downloadPath : null;

    if (!downloadUrl) return decorate([]);
    return decorate([{ title, artist, download: downloadUrl }]);
  } catch {
    return decorate([]);
  }
}