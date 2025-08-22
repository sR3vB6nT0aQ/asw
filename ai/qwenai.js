import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const validModels = [
  'qwen3-235b-a22b', 'qwen3-30b-a3b', 'qwen3-32b', 'qwen-max-latest', 'qwen-plus-2025-01-25',
  'qwq-32b', 'qwen-turbo-2025-02-11', 'qwen2.5-omni-7b', 'qvq-72b-preview-0310',
  'qwen2.5-vl-32b-instruct', 'qwen2.5-14b-instruct-1m', 'qwen2.5-coder-32b-instruct', 'qwen2.5-72b-instruct'
];

export async function qwenai(text, model = 'qwen-turbo-2025-02-11') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El texto debe ser una cadena de texto válida." }
    };
  }

  if (!validModels.includes(model)) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: `Modelos disponibles: ${validModels.join(', ')}` }
    };
  }

  try {
    const messages = [{ role: 'user', content: text }];

    const { data } = await axios.post('https://chat.qwen.ai/api/chat/completions', {
      stream: false,
      chat_type: 't2t',
      model,
      messages,
      session_id: uuidv4(),
      chat_id: uuidv4(),
      id: uuidv4()
    }, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NTI0YWVhLTNjMjEtNDgwMi05YWY0LTdjZThkNmEwZTE3MSIsImV4cCI6MTc1MDA5MTA2OX0.sDC1jJ4WPlyGzgVi6x6m4vQ31miAOxa1MedflPNKG38',
        'bx-v': '2.5.28',
        'content-type': 'application/json',
        // Nota: Las cookies y otros headers pueden actualizarse si es necesario
        cookie: '',
        host: 'chat.qwen.ai',
        origin: 'https://chat.qwen.ai',
        referer: 'https://chat.qwen.ai/',
        'sec-ch-ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'source': 'h5',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
        'version': '0.0.101',
        'x-request-id': uuidv4()
      }
    });

    if (!data?.choices?.[0]?.message?.content) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta del servidor QwenAI." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data.choices[0].message.content }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
