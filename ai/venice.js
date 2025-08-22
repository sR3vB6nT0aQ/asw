import axios from 'axios';

export async function venice(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El texto debe ser una cadena de texto válida." }
    };
  }

  try {
    const response = await axios.request({
      method: 'POST',
      url: 'https://outerface.venice.ai/api/inference/chat',
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: 'https://venice.ai',
        referer: 'https://venice.ai/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'x-venice-version': 'interface@20250523.214528+393d253'
      },
      data: JSON.stringify({
        requestId: 'nekorinn',
        modelId: 'dolphin-3.0-mistral-24b',
        prompt: [{ content: text, role: 'user' }],
        systemPrompt: '',
        conversationType: 'text',
        temperature: 0.8,
        webEnabled: true,
        topP: 0.9,
        isCharacter: false,
        clientProcessingTime: 15
      })
    });

    const chunks = response.data
      .split('\n')
      .filter(chunk => chunk)
      .map(chunk => JSON.parse(chunk));

    const result = chunks.map(chunk => chunk.content).join('');

    if (!result) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta del servidor Venice AI." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
