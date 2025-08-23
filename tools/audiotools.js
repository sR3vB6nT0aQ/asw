import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TMP_DIR = path.join(tmpdir(), 'tmp');

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const headers = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 13; moto g play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Origin': 'https://audioalter.com',
  'Referer': 'https://audioalter.com/'
};

async function uploadAudio(buffer) {
  const tmpPath = path.join(TMP_DIR, `${Date.now()}.mp3`);
  fs.writeFileSync(tmpPath, buffer);
  const form = new FormData();
  form.append('audio', fs.createReadStream(tmpPath));
  form.append('preview', 'false');
  const { data } = await axios.post('https://api.audioalter.com/pages/upload', form, {
    headers: { ...form.getHeaders(), ...headers }
  });
  fs.unlinkSync(tmpPath);
  return data.files[0].id;
}

async function process(tool, fileId, params = {}) {
  const { data } = await axios.post('https://api.audioalter.com/pages/process',
    { ids: [fileId], params, tool },
    { headers: { ...headers, 'Content-Type': 'application/json' } }
  );
  return data.id;
}

async function waitUntilReady(processId) {
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const { data } = await axios.get(`https://api.audioalter.com/pages/${processId}`, { headers });
    if (data.files?.[0]?.status === 2) return data.files[0].id;
  }
  throw new Error('Processing timeout');
}

async function download(fileId) {
  return `https://api.audioalter.com/download/${fileId}`;
}

/* ---------- Tools ---------- */
export async function bassBoost(audioBuffer, level = 5, normalize = true) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('bass-booster', fileId, { bass: level, normalize });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function audio3D(audioBuffer) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('3d-audio', fileId, {});
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function vocalRemover(audioBuffer) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('vocal-remover', fileId, {});
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function autoPanner(audioBuffer, frequency = 1.47, depth = 50) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('autopanner', fileId, { frequency, depth });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function noiseReducer(audioBuffer) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('noise-reducer', fileId, {});
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function pitchShifter(audioBuffer, pitch = 0) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('pitch-shifter', fileId, { pitch });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function reverb(audioBuffer, {
  reverberance = 62,
  wet = 0,
  preDelay = 0,
  stereoDepth = 100,
  roomScale = 100,
  damping = 50
} = {}) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('reverb', fileId, { reverberance, wet, preDelay, stereoDepth, roomScale, damping });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function reverseAudio(audioBuffer) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('reverse', fileId, {});
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function stereoPanner(audioBuffer, pan = 0) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('stereo-panner', fileId, { pan });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}

export async function tempo(audioBuffer, tempo = 1, preservePitch = true) {
  const fileId = await uploadAudio(audioBuffer);
  const processId = await process('tempo', fileId, { tempo, preservePitch });
  const processedId = await waitUntilReady(processId);
  return download(processedId);
}