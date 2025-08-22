import axios from "axios";
import * as cheerio from "cheerio";

export async function mediafire(url) {
  if (!url || typeof url !== 'string' || !url.includes('mediafire.com')) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de Mediafire." }
    };
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const downloadElement = $("#downloadButton");
    const downloadUrl = downloadElement.attr("href");
    const fileName = $(".dl-btn-label").text().trim();
    const fileSize = downloadElement.text().trim();

    if (!downloadUrl) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo encontrar el enlace de descarga." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        fileName,
        fileSize,
        downloadUrl
      }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
