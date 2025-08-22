import axios from 'axios';

export async function descargarCancion(url) {
  try {
    const response = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`);
    const data = response.data;
    if (!data.result) return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    const { id, gid } = data.result;
    const convertResponse = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${gid}/${id}`);
    const convertData = convertResponse.data;
    if (!convertData.result) return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: {
        file_url: `https://api.fabdl.com${convertData.result.download_url}`
      }
    };
  } catch {
    return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} };
  }
}

