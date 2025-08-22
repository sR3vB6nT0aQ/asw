import axios from 'axios';

export async function rSearch(query) {
  try {
    const url = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(query)}&limit=10`;
    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const users = data.data.slice(0, 5).map(user => ({
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      // Construimos la url de la imagen del avatar oficial de Roblox
      avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`
    }));

    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: users.length > 0,
      data: users
    };
  } catch (error) {
    return {
      autor: "🜲 ᵖᵃᵗᵒ",
      status: false,
      data: { error: error.response?.data || error.message || 'Error en búsqueda Roblox' }
    };
  }
}
