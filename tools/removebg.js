import axios from 'axios';
import FormData from 'form-data';

export async function removebg(imageBuffer) {
  if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: "Buffer de imagen inválido o no proporcionado." }
    };
  }

  try {
    const { data: html } = await axios.get('https://www.iloveimg.com/id/hapus-latar-belakang');
    const taskIdMatch = html.match(/taskId = '(\w+)/);
    const tokenMatch = html.match(/ey[a-zA-Z0-9?%-_/]+/g);

    if (!taskIdMatch || !tokenMatch || tokenMatch.length < 2) {
      return {
        autor: "🜲 ᵖᵃᵗᵒ",
        status: false,
        data: { error: "No se pudo obtener taskId o token." }
      };
    }

    const taskId = taskIdMatch[1];
    const token = tokenMatch[1];

    const api = axios.create({
      baseURL: 'https://api4g.iloveimg.com',
      headers: {
        'authorization': `Bearer ${token}`,
      }
    });

    const fileName = Math.random().toString(36).slice(2) + '.jpg';

    const form = new FormData();
    form.append('name', fileName);
    form.append('chunk', '0');
    form.append('chunks', '1');
    form.append('task', taskId);
    form.append('preview', '1');
    form.append('pdfinfo', '0');
    form.append('pdfforms', '0');
    form.append('pdfresetforms', '0');
    form.append('v', 'web.0');
    form.append('file', imageBuffer, fileName);

    const reqUpload = await api.post('/v1/upload', form, {
      headers: form.getHeaders()
    });

    if (reqUpload.status !== 200) throw reqUpload.data || reqUpload.statusText;

    const serverFilename = reqUpload.data?.server_filename;
    if (!serverFilename) throw new Error('No se recibió el nombre del archivo del servidor.');

    const formRmbg = new FormData();
    formRmbg.append('task', taskId);
    formRmbg.append('server_filename', serverFilename);

    const reqRmbg = await api.post('/v1/removebackground', formRmbg, {
      headers: formRmbg.getHeaders(),
      responseType: 'arraybuffer'
    });

    if (reqRmbg.status !== 200) throw reqRmbg.data || reqRmbg.statusText;

    const type = reqRmbg.headers['content-type'];
    if (!/image/.test(type)) throw new Error('Respuesta no es una imagen.');

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: true,
      data: { buffer: reqRmbg.data, mime: type }
    };

  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.message || "Error desconocido." }
    };
  }
}
