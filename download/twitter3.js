import axios from 'axios';
import cheerio from 'cheerio';

export async function twitter3(url) {
  try {
    const res = await axios.post('https://twmate.com/', new URLSearchParams({
      page: url,
      ftype: 'all',
      ajax: '1'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://twmate.com/',
      }
    });
    
    const $ = cheerio.load(res.data);
    const videoLinks = [];
    
    $('.btn-dl').each((index, element) => {
      const quality = $(element).parent().prev().text().trim();
      const downloadUrl = $(element).attr('href');
      if (downloadUrl && downloadUrl.includes('.mp4')) {
        videoLinks.push({
          quality, downloadUrl
        });
      }
    });
    
    if (!videoLinks.length) {
      return {
        "autor": "🜲 ᵖᵃᵗᵒ",
        "status": false,
        "data": []
      };
    }
    
    return {
      "autor": "🜲 ᵖᵃᵗᵒ",
      "status": true,
      "data": videoLinks
    };
  } catch {
    return {
      "autor": "🜲 ᵖᵃᵗᵒ",
      "status": false,
      "data": []
    };
  }
}
