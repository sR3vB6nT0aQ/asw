import axios from 'axios';
import cheerio from 'cheerio';

export async function notubesc(query) {
  const searchUrl = 'https://s60.notube.net/suggestion.php?lang=id';
  const payload = new URLSearchParams({
    keyword: query,
    format: 'mp3',
    subscribed: 'false'
  });

  try {
    const { data } = await axios.post(searchUrl, payload.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://notube.net',
        'Referer': 'https://notube.net/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];
    $('.row > a').each((i, element) => {
      const onclickAttr = $(element).attr('onclick');
      const urlMatch = onclickAttr?.match(/DOWNL\('([^']+)'/);
      const videoUrl = urlMatch ? urlMatch[1] : null;

      if (videoUrl) {
        const title = $(element).find('p').text().trim();
        const thumbnail = $(element).find('img').attr('src');
        const duration = $(element).find('div[style*="background-color"]').text().trim();
        const author = $(element).find('small font').first().text().trim();
        const description = $(element).find('small font').last().text().trim();

        results.push({
          title,
          author,
          duration,
          description,
          thumbnail,
          url: videoUrl,
        });
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
      data: { error: 'Error al buscar en Notube: ' + (error.message || error) }
    };
  }
}

export async function notubedl(url) {
  const serverUrl = 'https://s60.notube.net';

  try {
    const weightPayload = new URLSearchParams({ url, format: 'mp3', lang: 'id', subscribed: 'false' });
    const { data: weightData } = await axios.post(`${serverUrl}/recover_weight.php`, weightPayload.toString());

    const { token, name_mp4 } = weightData;
    if (!token) throw new Error('No se pudo obtener token.');

    const filePayload = new URLSearchParams({ url, format: 'mp3', name_mp4, lang: 'id', token, subscribed: 'false', playlist: 'false', adblock: 'false' });
    await axios.post(`${serverUrl}/recover_file.php?lang=id`, filePayload.toString());

    const conversionPayload = new URLSearchParams({ token });
    await axios.post(`${serverUrl}/conversion.php`, conversionPayload.toString());

    const downloadPageUrl = `https://notube.net/id/download?token=${token}`;
    const { data: pageData } = await axios.get(downloadPageUrl);

    const $ = cheerio.load(pageData);
    const title = $('#blocLinkDownload h2').text().trim();
    const finalDownloadUrl = $('#downloadButton').attr('href');

    if (!finalDownloadUrl || !finalDownloadUrl.includes('key=')) {
      throw new Error('Link de descarga inválido o inexistente.');
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title,
        download_url: finalDownloadUrl
      }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: 'Error al descargar en Notube: ' + (error.message || error) }
    };
  }
}
