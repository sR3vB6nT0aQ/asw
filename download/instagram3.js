import axios from "axios";
import cheerio from "cheerio";

async function instagram3(url) {
  try {
    const {
      data
    } = await axios.get(`https://snapdownloader.com/tools/instagram-downloader/download?url=${url}`);
    const $ = cheerio.load(data);
    const media = [];

    $(".download-item").each((_, el) => {
      const type = $(el).find(".type").text().trim().toLowerCase();
      const mediaUrl = $(el).find(".btn-download").attr("href");
      if (mediaUrl) media.push({
        type, url: mediaUrl
      });
    });

    return {
      author: '🜲 ᵖᵃᵗᵒ',
      status: media.length > 0,
      data: {
        media
      }
    };
  } catch {
    return {
      author: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: {}
    };
  }
}

export default instagram3;