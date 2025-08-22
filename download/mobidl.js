import axios from 'axios';

function extractVideoId(url) {
  const regYoutubeId = /https:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/watch\?v=)([^&|^?]+)/;
  return url.match(regYoutubeId)?.[2] || null;
}

async function mobidl(url, format = 'mp3') {
  if (!url || typeof url !== 'string') {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de YouTube." }
    };
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "No se pudo extraer el ID del video de YouTube." }
    };
  }

  const availableFormat = ["mp3", "mp4"];
  if (!availableFormat.includes(format.toLowerCase())) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: `Formato inválido. Usa: ${availableFormat.join(", ")}` }
    };
  }

  try {
    const urlParam = {
      v: videoId,
      f: format,
      _: Math.random()
    };

    const headers = {
      "Referer": "https://id.ytmp3.mobi/",
    };

    const fetchJson = async (url, desc) => {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Error en ${desc}: ${res.status} ${res.statusText}`);
      return await res.json();
    };

    const { convertURL } = await fetchJson("https://d.ymcdn.org/api/v1/init?p=y&23=1llum1n471&_=" + Math.random(), "init");
    const { progressURL, downloadURL } = await fetchJson(`${convertURL}&${new URLSearchParams(urlParam).toString()}`, "convert");

    let progress = 0, error, title;
    while (progress !== 3) {
      ({ error, progress, title } = await fetchJson(progressURL, "progreso"));
      if (error) throw new Error(error);
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { title, downloadURL }
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}

export const mobidlmp3 = (url) => mobidl(url, 'mp3');
export const mobidlmp4 = (url) => mobidl(url, 'mp4');
