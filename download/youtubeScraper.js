import axios from 'axios';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isValidYouTubeUrl(url) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1]: null;
}

async function ytdlmp3(url) {
  try {
    if (!url || !isValidYouTubeUrl(url)) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "URL de YouTube no válida."
        }
      };
    }

    const formData = new URLSearchParams();
    formData.append("url", url);

    const {
      data
    } = await axios.post(
      "https://www.youtubemp3.ltd/convert",
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 45000
      }
    );

    if (!data || !data.link) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "No se pudo obtener el link de descarga."
        }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        title: data.filename || "Título desconocido",
        downloadUrl: data.link,
        type: "mp3"
      }
    };

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "Tiempo de espera agotado, intenta más tarde."
        }
      };
    }
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: {
        error: error.response?.data?.message || error.message || "Error al convertir YouTube a MP3."
      }
    };
  }
}

async function ytdlmp4(url, quality = "720") {
  try {
    if (!url || !isValidYouTubeUrl(url)) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "URL de YouTube no válida."
        }
      };
    }

    const validQuality = {
      "480": 480,
      "1080": 1080,
      "720": 720,
      "360": 360,
      "audio": "mp3",
    };

    if (!Object.keys(validQuality).includes(quality)) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "Calidad no válida.",
          availableQuality: Object.keys(validQuality)
        }
      };
    }

    const qualityParam = validQuality[quality];

    const {
      data: firstRequest
    } = await axios.get(
      `https://p.oceansaver.in/ajax/download.php?button=1&start=1&end=1&format=${qualityParam}&iframe_source=https://allinonetools.com/&url=${encodeURIComponent(url)}`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!firstRequest || !firstRequest.progress_url) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "No se pudo iniciar el proceso de descarga."
        }
      };
    }

    const progressUrl = firstRequest.progress_url;
    let metadata = {
      image: firstRequest.info?.image || "",
      title: firstRequest.info?.title || "Título desconocido",
      downloadUrl: "",
      quality: quality,
      type: quality === "audio" ? "mp3": "mp4"
    };

    let data;
    let attempts = 0;
    const maxAttempts = 40;

    do {
      if (attempts >= maxAttempts) {
        return {
          autor: "🜲 ᵖᵃᵗᵒ",
          status: false,
          data: {
            error: "Timeout: proceso de descarga muy largo, intenta de nuevo."
          }
        };
      }

      await sleep(3000);

      try {
        const {
          data: pollData
        } = await axios.get(progressUrl, {
            timeout: 15000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
        data = pollData;
      } catch {
        // ignorar error y continuar
      }

      attempts++;
    } while (!data?.download_url);

    if (!data.download_url) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "No se pudo obtener la URL de descarga."
        }
      };
    }

    metadata.downloadUrl = data.download_url;

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: metadata
    };

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "Tiempo de espera agotado, intenta más tarde."
        }
      };
    }
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: {
        error: error.response?.data?.message || error.message || "Error al descargar video."
      }
    };
  }
}

export {
  ytdlmp3,
  ytdlmp4
};