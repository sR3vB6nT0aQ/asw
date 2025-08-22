import axios from 'axios';
import crypto from 'crypto';

async function timex() {
  const { data } = await axios.get('https://igram.world/msec');
  return Math.floor(data.msec * 1000);
}

async function generateSignature(url, secretKey) {
  const time = await timex();
  const ab = Date.now() - (time ? Date.now() - time : 0);
  const hashString = `${url}${ab}${secretKey}`;
  const signature = crypto.createHash('sha256').update(hashString).digest('hex');
  return { signature, ab, time };
}

export default async function igram(url) {
  const secretKey = '40a71e771b673e3a35200acdd331bbd616fc4ba76c6d77d821a25985e46fb488';
  const { signature, ab, time } = await generateSignature(url, secretKey);

  const requestData = {
    url,
    ts: ab,
    _ts: `1739185248317`,
    _tsc: time ? Date.now() - time : 0,
    _s: signature,
  };

  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0',
    'Referer': 'https://igram.world/',
    'Origin': 'https://igram.world/',
  };

  const { data } = await axios.post('https://api.igram.world/api/convert', requestData, { headers });

  let media = [];

  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.url?.[0]?.url) media.push(item.url[0].url);
    });
  } else if (data.url?.length) {
    media.push(data.url[0].url);
  }

  return {
    author: '🜲 ᵖᵃᵗᵒ',
    status: true,
    media
  };
}