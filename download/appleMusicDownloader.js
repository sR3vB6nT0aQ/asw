import axios from 'axios';

class AppleMusicDownloader {
  constructor() {
    this.baseUrl = 'https://aaplmusicdownloader.com';
    this.userAgent =
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36';
    this.headers = {
      authority: 'aaplmusicdownloader.com',
      accept: 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'ms-MY,ms;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': this.userAgent,
      'x-requested-with': 'XMLHttpRequest',
    };
  }

  async getSessionCookie() {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          ...this.headers,
          referer: `${this.baseUrl}/`,
        },
      });
      const setCookie = response.headers['set-cookie']?.[0];
      if (!setCookie) throw new Error('No se encontró la cabecera Set-Cookie');
      return setCookie.split(';')[0];
    } catch (error) {
      throw new Error(`Error obteniendo cookie de sesión: ${error.message}`);
    }
  }

  async search(url) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/applesearch.php`, {
        params: { url },
        headers: {
          ...this.headers,
          referer: `${this.baseUrl}/`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error en búsqueda: ${error.message}`);
    }
  }

  async download({ songName, artistName, url, quality = 'm4a', zipDownload = false }) {
    try {
      const cookie = await this.getSessionCookie();
      const form = new URLSearchParams({
        song_name: songName,
        artist_name: artistName,
        url,
        token: 'none',
        zip_download: zipDownload.toString(),
        quality,
      });

      const response = await axios.post(
        `${this.baseUrl}/api/composer/swd.php`,
        form,
        {
          headers: {
            ...this.headers,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            cookie,
            origin: this.baseUrl,
            referer: `${this.baseUrl}/song.php`,
          },
        }
      );

      // --- CORRECCIÓN: Forzar phmp3 en el dlink si existe phmp4 ---
      if (response.data?.dlink && typeof response.data.dlink === 'string') {
        response.data.dlink = response.data.dlink.replace('phmp4', 'phmp3');
      }
      if (response.data?.download && typeof response.data.download === 'string') {
        response.data.download = response.data.download.replace('phmp4', 'phmp3');
      }
      if (response.data?.download?.dlink && typeof response.data.download.dlink === 'string') {
        response.data.download.dlink = response.data.download.dlink.replace('phmp4', 'phmp3');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Error en descarga: ${error.message}`);
    }
  }
}

const downloader = new AppleMusicDownloader();

export async function appleMusicDownload(url, quality = 'm4a', zipDownload = false) {
  try {
    if (!url) throw new Error('No se proporcionó URL de Apple Music');
    const searchResult = await downloader.search(url);
    if (!searchResult || !searchResult.name || !searchResult.artist || !searchResult.url) {
      throw new Error('No se pudo obtener información de la canción');
    }
    const downloadResult = await downloader.download({
      songName: searchResult.name,
      artistName: searchResult.artist,
      url: searchResult.url,
      quality,
      zipDownload,
    });

    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        info: searchResult,
        download: downloadResult,
      },
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: { error: error.message || 'Error desconocido' },
    };
  }
}

