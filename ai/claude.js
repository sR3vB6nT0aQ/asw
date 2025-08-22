import axios from 'axios';
import { JSDOM } from 'jsdom';
import FormData from 'form-data';

export async function claude(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "El texto debe ser una cadena de texto válida." },
    };
  }

  const headers = {
    'Accept': '*/*',
    'Referer': 'https://claudeai.one/',
    'Origin': 'https://claudeai.one'
  };

  try {
    const { data: html } = await axios.get('https://claudeai.one/', { headers });
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const nonce = doc.querySelector('[data-nonce]')?.getAttribute('data-nonce') || '';
    const postId = doc.querySelector('[data-post-id]')?.getAttribute('data-post-id') || '';
    const botId = doc.querySelector('[data-bot-id]')?.getAttribute('data-bot-id') || '';

    const match = html.match(/localStorage\.setItem['"]wpaicg_chat_client_id['"],\s*['"](.+?)['"]/);
    const clientId = match ? match[1] : 'JHFiony-' + Math.random().toString(36).substring(2, 12);

    const form = new FormData();
    form.append('_wpnonce', nonce);
    form.append('post_id', postId);
    form.append('url', 'https://claudeai.one');
    form.append('action', 'wpaicg_chat_shortcode_message');
    form.append('message', text);
    form.append('bot_id', botId);
    form.append('chatbot_identity', 'shortcode');
    form.append('wpaicg_chat_history', '[]');
    form.append('wpaicg_chat_client_id', clientId);

    const { data } = await axios.post(
      'https://claudeai.one/wp-admin/admin-ajax.php',
      form,
      { headers: { ...headers, ...form.getHeaders() } }
    );

    if (!data?.data) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se recibió respuesta de Claude AI." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { result: data.data }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
