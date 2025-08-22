import axios from "axios";

export async function fluxGenerateAI(prompt) {
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El prompt debe ser una cadena de texto válido." },
    };
  }

  try {
    const { data } = await axios.post(
      "https://fluxai.pro/api/tools/fast",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; FluxAI-Client/1.0)",
          Accept: "application/json",
        },
      }
    );

    if (!data?.ok || !data?.data?.imageUrl) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "Falló al obtener la imagen de FluxAI." },
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { imageUrl: data.data.imageUrl },
    };
  } catch (err) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: err.message || "Error desconocido." },
    };
  }
}