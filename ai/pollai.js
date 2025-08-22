import axios from 'axios';

export async function pollai(question, { systemMessage = null, model = 'gpt-4.1-mini', imageBuffer = null } = {}) {
  const modelList = {
    'gpt-4.1': 'openai-large',
    'gpt-4.1-mini': 'openai',
    'gpt-4.1-nano': 'openai-fast'
  };

  if (!question || typeof question !== 'string' || !question.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "La pregunta debe ser una cadena de texto válida." }
    };
  }

  if (!modelList[model]) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: `Model disponible: ${Object.keys(modelList).join(', ')}` }
    };
  }

  try {
    const messages = [
      ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          ...(imageBuffer ? [{
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBuffer.toString('base64')}` }
          }] : [])
        ]
      }
    ];

    const { data } = await axios.post('https://text.pollinations.ai/openai', {
      messages,
      model: modelList[model],
      temperature: 0.5,
      presence_penalty: 0,
      top_p: 1,
      frequency_penalty: 0
    }, {
      headers: {
        accept: '*/*',
        authorization: 'Bearer dummy',
        'content-type': 'application/json',
        origin: 'https://sur.pollinations.ai',
        referer: 'https://sur.pollinations.ai/',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
      }
    });

    if (!data?.choices?.[0]?.message?.content) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta del servidor Pollinations." }
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
