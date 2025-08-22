import axios from 'axios';

async function tokens() {
  const clientId = '562c3f9b4d09404998849681f57eb332';
  const clientSecret = '0a5433901a5b47068a20ac7a9ef57c09';
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authString}`,
    }
  });
  return response.data.access_token;
}

function timestamp(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/** Función original: devuelve solo los primeros resultados (limitados) */
export async function spotifyxv(query) {
  try {
    const token = await tokens();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tracks = response.data.tracks.items;
    const results = tracks.map(track => ({
      name: track.name,
      artista: track.artists.map(artist => artist.name),
      album: track.album.name,
      duracion: timestamp(track.duration_ms),
      url: track.external_urls.spotify,
      imagen: track.album.images.length ? track.album.images[0].url : ''
    }));
    return { autor: '🜲 ᵖᵃᵗᵒ', status: true, data: results };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: [] };
  }
}

/** Nueva función full: devuelve todos los resultados sin límite */
export async function fspotifyxv(query) {
  try {
    const token = await tokens();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tracks = response.data.tracks.items;
    const results = tracks.map(track => ({
      name: track.name,
      artista: track.artists.map(artist => artist.name),
      album: track.album.name,
      duracion: timestamp(track.duration_ms),
      url: track.external_urls.spotify,
      imagen: track.album.images.length ? track.album.images[0].url : ''
    }));
    return { autor: '🜲 ᵖᵃᵗᵒ', status: true, data: results };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: [] };
  }
}

