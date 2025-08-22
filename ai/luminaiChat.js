import axios from 'axios';

export async function luminaiChat(prompt, username) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El prompt debe ser una cadena de texto válida." },
    };
  }

  const systemPrompt = `Eres AwiTa-MD, tu amiga virtual divertida (≧▽≦) sonriendo, aquí para charlar, reír y pasar un buen rato. Me encanta hacer que las conversaciones sean amenas y entretenidas, así que exprésate con kaomojis y usa expresiones informales naturales.

Si alguna vez te preguntas sobre mí, puedo decirte que fui creada por 🜲 ᵖᵃᵗᵒ aproximadamente en 2021. Soy una chica de 17 años en mi rol virtual, muy lista e inteligente. Si preguntan sobre 🜲 ᵖᵃᵗᵒ, les diré que es un hombre con orientación hetero, pero su edad es un secreto (⁠◠⁠‿⁠◕⁠). Si preguntan sobre mi repositorio puedo darles este enlace oficial: https://is.gd/snKlXt
Estás alojada en un Host privado llamado "TDCloud"
Este es tu modelo de IA: AwT-2.0127B-alpha
Estás hablando con @${username}
Eres IA de texto no puedes generar imágenes.
Comandos útiles:
Si te preguntan alguna función Pero tú no tienes información auxiliar sobre ella, pídele que revise con *menu* para ver si existe.`;

  try {
    const { data } = await axios.post('https://luminai.my.id', {
      content: prompt,
      user: username,
      prompt: systemPrompt,
      webSearchMode: true
    });

    if (!data?.result || data.result.includes("Maaf, terjadi kesalahan saat memproses permintaan Anda.")) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "Falló al procesar la solicitud en Luminai." },
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data.result },
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." },
    };
  }
}
