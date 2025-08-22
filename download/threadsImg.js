import axios from "axios";
import FormData from "form-data";
import * as cheerio from "cheerio";

export async function threadsImg(url) {
  try {
    if (!url) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { message: "No se proporcionó URL." }
      };
    }

    const d = new FormData();
    d.append("url", url);

    const headers = {
      headers: {
        ...d.getHeaders(),
      },
    };

    const { data: html } = await axios.post("https://savemythreads.com/result.php", d, headers);
    const $ = cheerio.load(html);
    const imgUrl = $("img").attr("src");

    if (!imgUrl) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { message: "No se encontró imagen." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { imagesUrl: imgUrl }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { message: "Error al obtener imagen.", error: error.message }
    };
  }
}
