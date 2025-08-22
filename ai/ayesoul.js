import WebSocket from 'ws';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import https from 'https';
import path from 'path';

const ayesoulScraper = {
  autor: "🜲 ᵖᵃᵗᵒ",
  api: {
    base: 'https://ayesoul.com/api',
    endpoint: {
      goto: '/attachgoto',
      websocket: 'wss://goto.ayesoul.com/',
      media: 'https://media.ayesoul.com/'
    }
  },
  headers: {
    'User-Agent': 'Postify/1.0.0',
    'Origin': 'https://ayesoul.com',
    'Referer': 'https://ayesoul.com/',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  },
  context: {
    messageId: null,
    question: null,
    answer: null,
    type: null
  },
  genId(length = 21) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },
  async uploadImage(img) {
    if (!img) {
      return {
        status: false,
        data: { error: '¿Dónde está la imagen? Parece que olvidaste especificarla.' }
      };
    }
    const form = new FormData();
    form.append('file', fs.createReadStream(img), {
      filename: path.basename(img),
      contentType: 'image/jpeg'
    });
    const xcs = `${this.genId(7)}-|BANKAI|-${this.genId(7)}`;
    try {
      const response = await axios.post(
        `${this.api.base}${this.api.endpoint.goto}`,
        form,
        {
          headers: { ...this.headers, ...form.getHeaders(), 'x-cache-sec': xcs },
          httpsAgent: new https.Agent({ rejectUnauthorized: false, keepAlive: true, timeout: 60000 }),
          timeout: 60000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      if (!response.data?.file_id) throw new Error('No se recibió el ID del archivo en la respuesta.');
      return { status: true, data: { file_id: response.data.file_id } };
    } catch {
      return { status: false, data: { error: 'Falló la carga del archivo. Intenta de nuevo, por favor.' } };
    }
  },
  createPayload(query, isFollowUp, attachments = []) {
    return {
      input: JSON.stringify({
        event: query,
        attach: attachments,
        dateObject: new Date().toLocaleString('en-US', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: 'numeric', minute: 'numeric', hour12: true
        }),
        currentDateTimeISOString: new Date().toISOString(),
        id: this.genId(),
        "x-cache-sec": `${this.genId(7)}-|BANKAI|-${this.genId(7)}`,
        chin_tapak_dum_dum: { cf_config: { unos: "", dos: "", tres: "", chin: "" } },
        nostal: isFollowUp && this.context.messageId ? [{
          id: this.context.messageId,
          rank: 1,
          question: this.context.question,
          answer: this.context.answer
        }] : [],
        ultra_mode: true,
        customExcludeList: []
      })
    };
  },
  references(text, sourcesRaw, refOps) {
    if (refOps === true) {
      return text.replace(/\[(\d+(?:,\s*\d+)*)\]/g, (match, p1) => {
        const indices = p1.split(',').map(n => parseInt(n.trim()) - 1);
        const urls = indices.map(i => (i >= 0 && i < sourcesRaw.length) ? sourcesRaw[i] : '').filter(Boolean);
        return urls.length ? urls.map(url => `[${url}](${url})`).join(', ') : match;
      });
    } else if (refOps === 'delete') {
      return text.replace(/\s*\[(\d+(?:,\s*\d+)*)\]\s*/g, '');
    }
    return text;
  },
  websoket(query, isFollowUp, attachments = [], refOps = false, count = 1) {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 5;
      let remainingCount = count;
      let isResolved = false;

      const connect = async () => {
        if (retryCount > 0) {
          const delay = Math.min(1000 * 2 ** retryCount + Math.random() * 1000, 10000);
          await new Promise(r => setTimeout(r, delay));
        }
        const wsOptions = {
          headers: {
            ...this.headers,
            'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-WebSocket-Version': '13',
            'Upgrade': 'websocket'
          },
          agent: new https.Agent({ rejectUnauthorized: false, keepAlive: true, timeout: 60000 }),
          followRedirects: true,
          maxPayload: 100 * 1024 * 1024
        };
        let socket;
        try {
          socket = new WebSocket(this.api.endpoint.websocket, wsOptions);
        } catch (e) {
          return retry();
        }
        let response = {
          sourcesRaw: [],
          contextSources: [],
          followUpQuestions: [],
          searchPlan: '',
          answer: '',
          messageId: null,
          images: []
        };
        let isAnswer = false;
        let fullAnswer = '';
        let connectionTimeout, activityTimeout, pingInterval;
        let lastPong = Date.now();

        const cleanup = () => {
          clearTimeout(connectionTimeout);
          clearTimeout(activityTimeout);
          clearInterval(pingInterval);
          if (socket?.readyState === WebSocket.OPEN) {
            try { socket.terminate(); } catch {}
          }
        };
        const retry = async () => {
          cleanup();
          if (!isResolved && retryCount < maxRetries) {
            retryCount++;
            await connect();
          } else if (!isResolved) {
            isResolved = true;
            reject(new Error(`Falló la conexión después de ${maxRetries} intentos. Intenta de nuevo más tarde.`));
          }
        };

        connectionTimeout = setTimeout(() => { if (!isResolved) retry(); }, 30000);

        socket.on('open', () => {
          clearTimeout(connectionTimeout);
          pingInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.ping();
              if (Date.now() - lastPong > 30000) retry();
            }
          }, 15000);
          activityTimeout = setTimeout(() => { if (!isResolved) retry(); }, 30000);
          try {
            socket.send(JSON.stringify(this.createPayload(query, isFollowUp, attachments)));
          } catch {
            retry();
          }
        });

        socket.on('pong', () => { lastPong = Date.now(); });

        socket.on('message', (data) => {
          clearTimeout(activityTimeout);
          activityTimeout = setTimeout(() => { if (!isResolved) retry(); }, 30000);
          try {
            const message = JSON.parse(data);
            switch (message.status) {
              case 'SOUL XDots':
                if (message.message?.sourcesRaw) response.sourcesRaw = message.message.sourcesRaw;
                break;
              case 'SOUL XMeta':
                if (message.message?.contextSources) response.contextSources = message.message.contextSources;
                if (message.message?.followUpQuestions) response.followUpQuestions = message.message.followUpQuestions;
                if (message.message?.genUiConfig?.searchPlan) response.searchPlan = message.message.genUiConfig.searchPlan;
                break;
              case 'SOUL XType':
                if (message.message === 'gen_image') response.answer = `Generando ${count} imágenes...`;
                break;
              case 'SOUL XCraft':
                isAnswer = true;
                break;
              case 'SOUL XStream':
                if (isAnswer) fullAnswer += message.message;
                break;
              case 'SOUL XImage':
                response.images.push(`${this.api.endpoint.media}${message.message}`);
                remainingCount--;
                if (remainingCount === 0) {
                  cleanup();
                  resolve(response);
                } else {
                  socket.send(JSON.stringify(this.createPayload(query, false, [])));
                }
                break;
              case 'SOUL XOver':
                response.messageId = message.message.id;
                if (response.images.length === 0) {
                  response.answer = this.references(fullAnswer, response.sourcesRaw, refOps);
                }
                if (remainingCount === 0 && !isResolved) {
                  isResolved = true;
                  cleanup();
                  resolve(response);
                }
                break;
            }
          } catch (e) { }
        });

        socket.on('close', () => {
          cleanup();
          if ((response.answer && response.answer.length > 0) || response.images.length > 0) {
            if (!isResolved) {
              isResolved = true;
              resolve(response);
            }
          } else {
            retry();
          }
        });

        socket.on('error', () => {
          if (!isResolved) retry();
        });
      };

      connect().catch(error => {
        if (!isResolved) {
          isResolved = true;
          reject(error);
        }
      });
    });
  },
  async request(query, options = {}) {
    if (!query?.trim()) {
      return { autor: this.autor, status: false, data: { error: 'La consulta no puede estar vacía.' } };
    }
    try {
      let isFollowUp = options.follow === true;
      let attachments = [];
      let type = 'chat';
      let refOps = options.useReferences;
      let count = options.count || 1;

      if (options.image) {
        const res = await this.uploadImage(options.image);
        if (!res.status) return { autor: this.autor, status: false, data: res.data };
        if (!res.data?.file_id) return { autor: this.autor, status: false, data: { error: 'No se pudo obtener el ID del archivo después de la carga.' } };
        attachments.push({
          file_id: res.data.file_id,
          name: path.basename(options.image),
          type: 'jpg',
          mime: 'image/jpeg'
        });
        type = 'vision';
        isFollowUp = false;
      }

      if (this.context.type !== 'chat') isFollowUp = false;

      const response = await this.websoket(query, isFollowUp, attachments, refOps, count);

      let resultData;
      if (response.images && response.images.length > 0) {
        type = 'genimage';
        resultData = { type: 'genimage', count: response.images.length, images: response.images };
      } else if (type === 'vision') {
        resultData = {
          type: 'vision',
          message: response.answer,
          file_id: attachments[0].file_id,
          sourcesRaw: response.sourcesRaw || [],
          contextSources: response.contextSources || [],
          followUpQuestions: response.followUpQuestions || []
        };
      } else {
        resultData = {
          type: 'chat',
          message: response.answer,
          sourcesRaw: response.sourcesRaw || [],
          contextSources: response.contextSources || [],
          followUpQuestions: response.followUpQuestions || [],
          searchPlan: response.searchPlan || ''
        };
      }

      this.context = {
        messageId: response.messageId,
        question: query,
        answer: response.answer,
        type
      };

      return { autor: this.autor, status: true, data: resultData };
    } catch (error) {
      return { autor: this.autor, status: false, data: { error: error.message || 'Ocurrió un error al procesar la solicitud.' } };
    }
  },
  resetSession() {
    this.context = { messageId: null, question: null, answer: null, type: null };
    return { autor: this.autor, status: true, data: { message: 'La sesión de chat se ha reiniciado correctamente.' } };
  }
};

export default ayesoulScraper;