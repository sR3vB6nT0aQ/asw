import axios from 'axios';
import * as cheerio from 'cheerio';

async function getSecurityToken() {
  const { data: html } = await axios.get('https://evoig.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  const $ = cheerio.load(html);
  const token =
    $('script:contains("ajax_var")')
      .html()
      ?.match(/"security"\s*:\s*"([a-z0-9]{10,})"/i)?.[1] ||
    html.match(/"security"\s*:\s*"([a-z0-9]{10,})"/i)?.[1] ||
    null;

  return token;
}

export async function igdl5(url) {
  if (!url || typeof url !== 'string' || !url.includes('instagram.com')) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Debes ingresar una URL válida de Instagram." }
    };
  }

  try {
    const token = await getSecurityToken();
    if (!token) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el token de seguridad." }
      };
    }

    const form = new URLSearchParams();
    form.append('action', 'ig_download');
    form.append('security', token);
    form.append('ig_url', url);

    const { data } = await axios.post('https://evoig.com/wp-admin/admin-ajax.php', form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://evoig.com',
        'referer': 'https://evoig.com/',
        'user-agent': 'Mozilla/5.0',
        'x-requested-with': 'XMLHttpRequest'
      }
    });

    const result = data?.data?.data?.[0];
    if (!result || !result.link) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener el enlace de descarga." }
      };
    }

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: {
        type: result.type,
        thumb: result.thumb,
        url: result.link
      }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
