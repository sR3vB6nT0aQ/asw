import axios from 'axios';
import https from 'https';

// Función para extraer JSON de ytInitialData
function extractYtInitialData(html) {
    const match = html.match(/var ytInitialData = ({.+?});/s);
    if (!match) throw new Error('ytInitialData no encontrado');
    return JSON.parse(match[1]);
}

// Función para convertir duración a segundos
function parseDuration(durationText) {
    if (!durationText) return 0;
    const parts = durationText.split(':').map(Number);
    return parts.length === 3 
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : parts[0] * 60 + parts[1];
}

// Función para limpiar número de vistas
function parseViews(viewText) {
    if (!viewText) return 0;
    const num = viewText.replace(/[^0-9.]/g, '');
    return parseInt(num) || 0;
}

// Headers de navegador real
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
};

// Función base de búsqueda en YouTube
async function searchYouTube(query, limit = 1) {
    try {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers,
            timeout: 10000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const data = extractYtInitialData(response.data);
        
        const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents
            ?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

        const videos = [];
        
        for (const item of contents) {
            const video = item.videoRenderer;
            if (!video) continue;

            const videoData = {
                videoId: video.videoId,
                title: video.title?.runs?.[0]?.text || '',
                channel: video.ownerText?.runs?.[0]?.text || '',
                duration: video.lengthText?.simpleText || '',
                durationSeconds: parseDuration(video.lengthText?.simpleText || ''),
                views: video.viewCountText?.simpleText || '',
                viewCount: parseViews(video.viewCountText?.simpleText || ''),
                thumbnail: video.thumbnail?.thumbnails?.[0]?.url || '',
                url: `https://youtu.be/${video.videoId}`,
                publishedTime: video.publishedTimeText?.simpleText || ''
            };

            videos.push(videoData);
            if (limit && videos.length >= limit) break;
        }

        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: true,
            data: limit === 1 ? videos[0] || null : videos
        };
    } catch (error) {
        console.error('Error en YouTube search:', error.message);
        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: false,
            data: limit === 1 ? null : []
        };
    }
}

// Función de búsqueda simple (1 resultado)
export async function ytSearch(query) {
    return await searchYouTube(query, 1);
}

// Función de búsqueda completa (todos los resultados)
export async function fytSearch(query) {
    return await searchYouTube(query, null);
}