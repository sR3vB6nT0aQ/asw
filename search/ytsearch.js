import yts from 'yt-search';

export async function ytSearch(query) {
  try {
    const search = await yts(query);
    const video = search.videos[0];
    if (!video) return null;
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: video
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: null
    };
  }
}

export async function fytSearch(query) {
  try {
    const search = await yts(query);
    const videos = search.videos;
    if (!videos || videos.length === 0) {
      return {
        autor: '🜲 ᵖᵃᵗᵒ',
        status: false,
        data: []
      };
    }
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: true,
      data: videos
    };
  } catch (error) {
    return {
      autor: '🜲 ᵖᵃᵗᵒ',
      status: false,
      data: []
    };
  }
}
