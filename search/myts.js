import axios from 'axios';
import https from 'https';

// Headers específicos para YouTube Music
const musicHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://music.youtube.com',
    'Referer': 'https://music.youtube.com/'
};

// Función para extraer datos de YouTube Music
function extractMusicData(html) {
    // Buscar ytInitialData específico de YouTube Music
    const match = html.match(/var ytInitialData = ({.+?});/s);
    if (!match) throw new Error('ytInitialData no encontrado en Music');
    return JSON.parse(match[1]);
}

// Función para parsear resultados de música
function parseMusicResults(data) {
    const contents = data.contents?.sectionListRenderer?.contents || [];
    const results = [];

    for (const section of contents) {
        const items = section.musicShelfRenderer?.contents || 
                     section.musicCardShelfRenderer?.contents || [];
        
        for (const item of items) {
            const track = item.musicResponsiveListItemRenderer;
            if (!track) continue;

            // Extraer título
            const titleRun = track.flexColumns?.[0]?.musicResponsiveListItemFlexColumnRenderer
                ?.text?.runs?.[0];
            
            // Extraer artistas
            const artistRuns = track.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer
                ?.text?.runs || [];
            const artists = artistRuns.filter(run => run.navigationEndpoint)
                .map(run => run.text);

            // Extraer álbum
            const albumRun = track.flexColumns?.[2]?.musicResponsiveListItemFlexColumnRenderer
                ?.text?.runs?.[0];

            // Extraer duración
            const durationText = track.fixedColumns?.[0]?.musicResponsiveListItemFixedColumnRenderer
                ?.text?.runs?.[0]?.text || '';

            // Extraer thumbnails
            const thumbnails = track.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];

            results.push({
                videoId: track.navigationEndpoint?.watchEndpoint?.videoId || '',
                title: titleRun?.text || '',
                artists: artists,
                album: albumRun?.text || '',
                duration: durationText,
                durationSeconds: parseDuration(durationText),
                thumbnail: thumbnails[0]?.url || '',
                url: `https://music.youtube.com/watch?v=${track.navigationEndpoint?.watchEndpoint?.videoId || ''}`,
                type: track.navigationEndpoint?.watchEndpoint?.watchEndpointMusicSupportedConfigs
                    ?.watchEndpointMusicConfig?.musicVideoType || 'song'
            });
        }
    }

    return results;
}

// Función base de búsqueda en YouTube Music
async function searchYouTubeMusic(query, limit = 1) {
    try {
        const searchUrl = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: musicHeaders,
            timeout: 10000,
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });

        const data = extractMusicData(response.data);
        const results = parseMusicData(data);
        
        const limitedResults = limit ? results.slice(0, limit) : results;

        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: true,
            data: limit === 1 ? limitedResults[0] || null : limitedResults
        };
    } catch (error) {
        console.error('Error en YouTube Music search:', error.message);
        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: false,
            data: limit === 1 ? null : []
        };
    }
}

// Función auxiliar para parsear duración (mismo que YouTube)
function parseDuration(durationText) {
    if (!durationText) return 0;
    const parts = durationText.split(':').map(Number);
    return parts.length === 3 
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : parts[0] * 60 + parts[1];
}

// Función de búsqueda simple (1 resultado)
export async function ytmSearch(query) {
    return await searchYouTubeMusic(query, 1);
}

// Función de búsqueda completa (todos los resultados)
export async function fytmSearch(query) {
    return await searchYouTubeMusic(query, null);
}

// Función especial para obtener metadatos extendidos de YouTube Music
export async function ytmMetadata(videoId) {
    try {
        const url = `https://music.youtube.com/watch?v=${videoId}`;
        const response = await axios.get(url, {
            headers: musicHeaders,
            timeout: 10000
        });

        const data = extractMusicData(response.data);
        
        // Extraer información más detallada
        const playerResponse = response.data.match(/var ytInitialPlayerResponse = ({.+?});/s);
        if (playerResponse) {
            const playerData = JSON.parse(playerResponse[1]);
            const videoDetails = playerData.videoDetails;
            
            return {
                autor: '🜲 ᵖᵃᵗᵒ',
                status: true,
                data: {
                    videoId: videoId,
                    title: videoDetails.title,
                    artist: videoDetails.author,
                    duration: parseInt(videoDetails.lengthSeconds),
                    viewCount: parseInt(videoDetails.viewCount),
                    thumbnails: videoDetails.thumbnail?.thumbnails || [],
                    description: videoDetails.shortDescription,
                    isLive: videoDetails.isLiveContent,
                    keywords: videoDetails.keywords || []
                }
            };
        }
    } catch (error) {
        console.error('Error en YouTube Music metadata:', error.message);
        return {
            autor: '🜲 ᵖᵃᵗᵒ',
            status: false,
            data: null
        };
    }
}