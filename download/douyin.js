import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function douyinDl(url) {
  try {
    const apiUrl = "https://lovetik.app/api/ajaxSearch";
    const formBody = new URLSearchParams();
    formBody.append("q", url);
    formBody.append("lang", "id");

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: formBody.toString()
    });

    const data = await res.json();
    if (data.status !== "ok") {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el video de Douyin." }
      };
    }

    const $ = cheerio.load(data.data);
    const video = $(".dl-action a").filter((i, el) => /mp4/i.test($(el).text())).first().attr("href");

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        url: video
      }
    };
  } catch (e) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: e.message || e }
    };
  }
}