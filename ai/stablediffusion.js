import axios from 'axios';

const modelList = {
  chatgpt4: {
    api: 'https://stablediffusion.fr/gpt4/predict2',
    referer: 'https://stablediffusion.fr/chatgpt4'
  },
  chatgpt3: {
    api: 'https://stablediffusion.fr/gpt3/predict',
    referer: 'https://stablediffusion.fr/chatgpt3'
  }
};

async function gpt4(prompt) {
  return sendRequest('chatgpt4', prompt);
}

async function gpt3(prompt) {
  return sendRequest('chatgpt3', prompt);
}

async function sendRequest(model, prompt) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: {
        error: "El prompt debe ser una cadena de texto válida."
      },
    };
  }

  try {
    const hmm = await axios.get(modelList[model].referer);
    const {
      data
    } = await axios.post(
      modelList[model].api,
      {
        prompt
      },
      {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
          origin: 'https://stablediffusion.fr',
          referer: modelList[model].referer,
          cookie: hmm.headers['set-cookie']?.join('; ') || '',
          'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    if (!data?.message) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: {
          error: "No se recibió respuesta del servidor."
        }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        result: data.message
      }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: {
        error: error.message || "Error desconocido."
      }
    };
  }
}

export {
  gpt4,
  gpt3
};