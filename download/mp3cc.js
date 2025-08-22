import axios from 'axios';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const headers = {
  "Referer": "https://ytmp3.cc/",
  "Origin": "https://ytmp3.cc/",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
};

async function hit(url, desc, returnType = "text") {
  const listReturnType = ["text", "json"];
  if (!listReturnType.includes(returnType)) throw Error(`Tipo de retorno inválido: ${returnType}`);
  const response = await fetch(url, { headers });
  const data = await response.text();
  if (!response.ok) throw Error(`${response.status} ${response.statusText}\n${data.split("\n").slice(0,4).join("\n") + "\n...." || null}`);
  if (returnType === "json") {
    try {
      return { result: JSON.parse(data), response };
    } catch (e) {
      throw Error(`Error al parsear JSON: ${e.message}`);
    }
  }
  return { result: data, response };
}

async function getAuthCode() {
  const { result: html, response } = await hit("https://ytmp3.cc", "homepage");
  const valueOnHtml = html.match(/<script>(.*?)<\/script>/)?.[1];
  if (!valueOnHtml) throw Error("No se encontró el código de autorización en el HTML.");

  try { eval(valueOnHtml); } catch (e) { throw Error(`Error en eval: ${e.message}`); }

  const srcPath = html.match(/src="(.*?)"/)?.[1];
  if (!srcPath) throw Error("No se encontró el srcPath del JS.");

  const url = new URL(response.url).origin + srcPath;
  const { result: jsCode } = await hit(url, "JS file");
  const authCode = jsCode.match(/authorization\(\){(.*?)}function/)?.[1];
  if (!authCode) throw Error("No se encontró la función de autorización.");
  const newAuthCode = authCode.replace('id("ytmp3").src', `"${url}"`);
  let authString;
  try { authString = eval(`(()=>{${newAuthCode}})()`); } catch (e) { throw Error(`Error en eval authString: ${e.message}`); }
  return authString;
}

async function getYoutubeId(youtubeUrl) {
  const resp = await fetch(youtubeUrl, { method: "HEAD", headers: { "user-agent": headers["user-agent"] } });
  if (!resp.ok) throw Error(`No se pudo obtener el ID del video: ${resp.status} ${resp.statusText}`);
  let videoId = new URL(resp.url)?.searchParams?.get("v");
  if (!videoId) videoId = resp.url.match(/https:\/\/www.youtube.com\/shorts\/(.*?)(?:\?|$)/)?.[1];
  if (!videoId) throw Error("No se pudo extraer el ID del video.");
  return { videoId, url: resp.url };
}

async function mp3cc(youtubeUrl, format = "mp3") {
  const validFormats = ["mp3", "mp4"];
  if (!validFormats.includes(format)) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: `Formato inválido. Usa: ${validFormats.join(", ")}` }
    };
  }

  try {
    const { videoId, url } = await getYoutubeId(youtubeUrl);
    const authCode = await getAuthCode();

    const url1 = `https://d.ecoe.cc/api/v1/init?a=${authCode}&_=${Math.random()}`;
    const { result: resultInit } = await hit(url1, "init api", "json");
    if (resultInit.error != "0") throw Error(`Error en init api: ${JSON.stringify(resultInit)}`);

    const url2 = new URL(resultInit.convertURL);
    url2.searchParams.append("v", videoId);
    url2.searchParams.append("f", format);
    url2.searchParams.append("_", Math.random());
    const { result: resultConvert } = await hit(url2, "convert", "json");
    let { downloadURL, progressURL, redirectURL, error: errorFromConvertUrl } = resultConvert;
    if (errorFromConvertUrl) throw Error("Error en convertURL.");

    if (redirectURL) {
      ({ downloadURL, progressURL } = (await hit(redirectURL, "redirect", "json")).result);
    }

    let error, progress, title;
    while (progress != 3) {
      const api3 = new URL(progressURL);
      api3.searchParams.append("_", Math.random());
      ({ error, progress, title } = (await hit(api3, "progreso", "json")).result);
      if (error) throw Error(`Error en progreso: ${error}`);
      if (progress != 3) await delay(5000);
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { title, downloadURL, url }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}

export const mp3ccmp3 = (url) => mp3cc(url, 'mp3');
export const mp3ccmp4 = (url) => mp3cc(url, 'mp4');
