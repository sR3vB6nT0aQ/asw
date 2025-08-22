import axios from 'axios';

const CLIENT_ID = 'KKzJxmw11tYpCs6T24P4uUYhqmjalG6M';

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function fetchTracks(query, limit = 5) {
  try {
    const url = `https://api-v2.soundcloud.com/search/tracks?q=${encodeURIComponent(query)}&client_id=${CLIENT_ID}&limit=${limit}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    return data.collection.map(track => ({
      id: track.id,
      titulo: track.title,
      artista: track.user.username,
      url: track.permalink_url,
      thumbnail: track.artwork_url?.replace('-large', '-t500x500') || track.user.avatar_url,
      duracion: formatDuration(track.duration)
    }));
  } catch (error) {
    console.error('Error en buscarSoundCloud:', error);
    return [];
  }
}

export async function soundcloudSearch(query) {
  const tracks = await fetchTracks(query, 5);
  return {
    autor: "🜲 ᵖᵃᵗᵒ",
    status: tracks.length > 0,
    data: tracks
  };
}

export async function fsoundcloudSearch(query) {
  const tracks = await fetchTracks(query, 50); // máximo 50 resultados
  return {
    autor: "🜲 ᵖᵃᵗᵒ",
    status: tracks.length > 0,
    data: tracks
  };
}
