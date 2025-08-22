import axios from 'axios';
import cheerio from 'cheerio';

export default async function fbdl2(url) {
  try {
    const form = new URLSearchParams({
      codehap_link: url,
      codehap: true
    });

    const { data } = await axios.post('https://fadown.com/result.php', form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://fadown.com",
        "Referer": "https://fadown.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        cookie: `codehap_domain=fadown.com`
      }
    });

    const $ = cheerio.load(data);
    const result = {
      image: [],
      video: []
    };

    $('.row .col-sm-6').has('img').each((i, e) => {
      const url = $(e).find('a').attr('href');
      result.image.push(url);
    });

    $('.row .col-sm-6').has('video').each((i, e) => {
      const url = $(e).find('a').attr('href');
      result.video.push(url);
    });

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: result.video.length > 0,
      data: result
    };
  } catch (e) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: e.message || e }
    };
  }
}
