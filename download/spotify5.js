import axios from 'axios';

const s = {
  tools: {
    async hit(description, url, options, returnType = 'text') {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw Error(`${response.status} ${response.statusText}\n${await response.text() || '(response body vacío)'}`);
        if (returnType === 'text') {
          const data = await response.text();
          return { data, response };
        } else if (returnType === 'json') {
          const data = await response.json();
          return { data, response };
        } else {
          throw Error(`Parámetro returnType inválido.`);
        }
      } catch (e) {
        throw Error(`Error en ${description}: ${e.message}`);
      }
    }
  },

  get baseUrl() {
    return 'https://spotisongdownloader.to';
  },

  get baseHeaders() {
    return {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 Edg/139.0.0.0'
    };
  },

  async getCookie() {
    const url = this.baseUrl;
    const headers = this.baseHeaders;
    const { response } = await this.tools.hit('homepage', url, { headers });
    let cookie = response.headers.get('set-cookie')?.split('; ')[0] || '';
    if (!cookie.length) throw Error('No se pudo obtener la cookie');
    cookie += '; _ga=GA1.1.2675401.1754827078';
    return { cookie };
  },

  async ifCaptcha(gcObject) {
    const pathname = '/ifCaptcha.php';
    const url = new URL(pathname, this.baseUrl);
    const headers = {
      referer: new URL(this.baseUrl).href,
      ...gcObject,
      ...this.baseHeaders
    };
    await this.tools.hit('ifCaptcha', url, { headers });
    return headers;
  },

  async singleTrack(spotifyTrackUrl, icObject) {
    const pathname = '/api/composer/spotify/xsingle_track.php';
    const url = new URL(pathname, this.baseUrl);
    url.search = new URLSearchParams({ url: spotifyTrackUrl });
    const headers = icObject;
    const { data } = await this.tools.hit('single track', url, { headers }, 'json');
    return data;
  },

  async singleTrackHtml(stObject, icObj) {
    const payload = [
      stObject.song_name,
      stObject.duration,
      stObject.img,
      stObject.artist,
      stObject.url,
      stObject.album_name,
      stObject.released
    ];
    const pathname = '/track.php';
    const url = new URL(pathname, this.baseUrl);
    const headers = icObj;
    const body = new URLSearchParams({ data: JSON.stringify(payload) });
    await this.tools.hit('track html', url, { headers, body, method: 'post' });
    return true;
  },

  async downloadUrl(spotifyTrackUrl, icObj, stObj) {
    const pathname = '/api/composer/spotify/ssdw23456ytrfds.php';
    const url = new URL(pathname, this.baseUrl);
    const headers = icObj;
    const body = new URLSearchParams({
      song_name: '',
      artist_name: '',
      url: spotifyTrackUrl,
      zip_download: 'false',
      quality: 'm4a'
    });
    const { data } = await this.tools.hit('get download url', url, { headers, body, method: 'post' }, 'json');
    return { ...data, ...stObj };
  },

  async download(spotifyTrackUrl) {
    const gcObj = await this.getCookie();
    const icObj = await this.ifCaptcha(gcObj);
    const stObj = await this.singleTrack(spotifyTrackUrl, icObj);
    await this.singleTrackHtml(stObj, icObj);
    const dlObj = await this.downloadUrl(spotifyTrackUrl, icObj, stObj);
    return dlObj;
  }
};

/**
 * Función principal scrapper Spotify5
 * @param {string} spotifyTrackUrl - URL de la canción de Spotify
 * @returns {Promise<object>} - Objeto con estructura {autor, status, data}
 */
export async function spdl5(spotifyTrackUrl) {
  if (!spotifyTrackUrl || typeof spotifyTrackUrl !== 'string' || !spotifyTrackUrl.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: 'Debes proporcionar un enlace válido de Spotify.' }
    };
  }

  try {
    const result = await s.download(spotifyTrackUrl);
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: result
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || 'Error desconocido.' }
    };
  }
}