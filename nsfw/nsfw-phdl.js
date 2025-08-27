import axios from 'axios';

const ENDPOINT = 'https://download.pornhubdownloader.io/xxx-download/video-info-v3';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 13; moto g play - 2023 Build/T3SGS33.165-46-3-1-22) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.181 Mobile Safari/537.36',
    'Content-Type': 'application/json',
    'sec-ch-ua-platform': '"Android"',
    'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Android WebView";v="138"',
    'sec-ch-ua-mobile': '?1',
    'origin': 'https://pornhubdownloader.io',
    'x-requested-with': 'mark.via.gp',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://pornhubdownloader.io/',
    'accept-language': 'es-US,es;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i'
};

export async function phdl(url) {
    try {
        const { data } = await axios.post(
            ENDPOINT,
            { platform: 'Pornhub', url, app_id: 'pornhub_downloader' },
            { headers: HEADERS }
        );

        if (data.code !== 200 || !data.data || data.data.videos.length === 0) {
            return {
                autor: '🜲 ᵖᵃᵗᵒ',
                status: false,
                data: []
            };
        }

        const targetVideo = data.data.videos[0];

        if (!targetVideo || !targetVideo.url) {
            return {
                autor: '🜲 ᵖᵃᵗᵒ',
                status: false,
                data: []
            };
        }

        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: true,
            data: {
                title: data.data.title,
                cover: data.data.cover,
                url: targetVideo.url
            }
        };

    } catch (e) {
        console.error('[Scraper - phdl] Error:', e.message);
        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: false,
            data: []
        };
    }
}