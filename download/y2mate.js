import fetch from 'node-fetch';

const y2mate = {
  headers: {
    Referer: 'https://y2mate.nu/',
    Origin: 'https://y2mate.nu/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
  },

  hit: async (url, desc, returnType = 'text') => {
    const listReturnType = ['text',
      'json'];
    if (!listReturnType.includes(returnType)) throw new Error(`return type ${returnType} is invalid.`);
    const response = await fetch(url, {
      headers: y2mate.headers
    });
    const data = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}\n${data.split('\n').slice(0, 4).join('\n')}\n....`);
    if (returnType === 'json') {
      try {
        return {
          result: JSON.parse(data),
          response
        };
      } catch (e) {
        throw new Error(`Error parsing JSON: ${e.message}`);
      }
    }
    return {
      result: data,
      response
    };
  },

  getAuthCode: async () => {
    const {
      result: html,
      response
    } = await y2mate.hit('https://y2mate.nu', 'homepage y2mate');
    const valueOnHtml = html.match(/<script>(.*?)<\/script>/)?.[1];
    if (!valueOnHtml) throw new Error('No se encontró código JS en HTML');
    let authString;
    try {
      eval(valueOnHtml);
      const srcPath = html.match(/src="(.*?)"/)?.[1];
      if (!srcPath) throw new Error('No se encontró srcPath JS');
      const url = new URL(response.url).origin + srcPath;
      const {
        result: jsCode
      } = await y2mate.hit(url, 'JS file y2mate');
      const authCode = jsCode.match(/authorization\(\){(.*?)}function/)?.[1];
      if (!authCode) throw new Error('No se encontró código de autorización');
      const newAuthCode = authCode.replace('id("y2mate").src', `"${url}"`);
      authString = eval(`(()=>{${newAuthCode}})()`);
    } catch (e) {
      throw new Error(`Error al obtener authString: ${e.message}`);
    }
    return authString;
  },

  getYoutubeId: async (youtubeUrl) => {
    const headers = {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
    };
    const resp = await fetch(youtubeUrl, {
      method: 'HEAD', headers
    });
    if (!resp.ok) throw new Error(`Error al obtener ID video ${resp.status} ${resp.statusText}`);
    let videoId = new URL(resp.url).searchParams.get('v');
    if (!videoId) {
      videoId = resp.url.match(/https:\/\/www.youtube.com\/shorts\/(.*?)(?:\?|$)/)?.[1];
      if (!videoId) throw new Error('URL inválida o no contiene ID de video');
    }
    return {
      videoId,
      url: resp.url
    };
  },

  download: async (youtubeUrl, format = 'mp3') => {
    if (!['mp3', 'mp4'].includes(format)) throw new Error(`Formato inválido: ${format}`);
    const delay = ms => new Promise(r => setTimeout(r, ms));
    const {
      videoId,
      url
    } = await y2mate.getYoutubeId(youtubeUrl);
    const authCode = await y2mate.getAuthCode();
    const url1 = `https://d.ecoe.cc/api/v1/init?a=${authCode}&_=${Math.random()}`;
    const {
      result: resultInit
    } = await y2mate.hit(url1, 'init api', 'json');
    if (resultInit.error !== '0') throw new Error(`Error en init api: ${JSON.stringify(resultInit)}`);
    const url2 = new URL(resultInit.convertURL);
    url2.searchParams.append('v', videoId);
    url2.searchParams.append('f', format);
    url2.searchParams.append('_', Math.random());
    let {
      result: resultConvert
    } = await y2mate.hit(url2, 'convert', 'json');
    let {
      downloadURL,
      progressURL,
      redirectURL,
      error: errorFromConvert
    } = resultConvert;
    if (errorFromConvert) throw new Error('Error en convertURL, video posiblemente inválido');
    if (redirectURL) {
      ({
        downloadURL, progressURL
      } = (await y2mate.hit(redirectURL, 'redirectURL', 'json')).result);
    }
    let error,
    progress,
    title;
    while (progress !== 3) {
      const api3 = new URL(progressURL);
      api3.searchParams.append('_', Math.random());
      ({
        error, progress, title
      } = (await y2mate.hit(api3, 'progress check', 'json')).result);
      if (error) throw new Error(`Error en progreso: ${error}`);
      if (progress !== 3) await delay(5000);
    }
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title,
        downloadURL,
        url
      }
    };
  }
};

export const y2ma = async (url) => y2mate.download(url, 'mp3');
export const y2mv = async (url) => y2mate.download(url, 'mp4');
export const y2mu = y2mate.getYoutubeId;