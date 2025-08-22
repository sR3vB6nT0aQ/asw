import axios from "axios";
import FormData from "form-data";
import * as cheerio from "cheerio";

const BASE_URL = "https://savetwitter.net";
const AJAX_URL = "/api/ajaxSearch";

export async function twitter(url) {
  try {
    let d = new FormData();
    d.append("q", url);
    d.append("lang", "en");
    d.append("cftoken", "");
    let headers = { ...d.getHeaders() };

    let { data: html } = await axios.post(BASE_URL + AJAX_URL, d, { headers });
    const $ = cheerio.load(html.data);

    if ($(".photo-list").length) {
      const images = [];
      $(".photo-list .download-items__thumb img").each((i, el) => {
        images.push({
          type: "image",
          thumb: $(el).attr("src"),
          download: $(el).closest(".download-items").find("a").attr("href")
        });
      });
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: images
      };
    }

    if ($(".tw-video").length) {
      const videos = [];
      $(".tw-video .tw-right .dl-action a").each((i, el) => {
        videos.push({
          type: "video",
          quality: $(el).text().trim().replace("Download MP4", "").trim(),
          download: $(el).attr("href")
        });
      });
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: true,
        data: videos
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: []
    };
  } catch {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: []
    };
  }
}
