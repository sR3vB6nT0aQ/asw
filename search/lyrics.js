import axios from 'axios'

async function getLyricsFromLRCLib(songName, artistName) {
  try {
    const search = encodeURIComponent(`${songName} ${artistName}`)
    const searchRes = await axios.get(`https://lrclib.net/api/search?q=${search}`)
    if (!Array.isArray(searchRes.data) || !searchRes.data.length) return null
    const id = searchRes.data[0].id
    const lyricsRes = await axios.get(`https://lrclib.net/api/get/${id}`)
    if (!lyricsRes.data || !lyricsRes.data.syncedLyrics) return null
    return lyricsRes.data.syncedLyrics
  } catch {
    return null
  }
}

async function getLyricsFromApple(songName, artistName) {
  try {
    const search = encodeURIComponent(`${songName} ${artistName}`)
    const searchRes = await axios.get(`https://paxsenix.alwaysdata.net/searchAppleMusic.php?q=${search}`)
    if (!Array.isArray(searchRes.data) || !searchRes.data.length) return null
    const id = searchRes.data[0].id
    const lyricsRes = await axios.get(`https://paxsenix.alwaysdata.net/getAppleMusicLyrics.php?id=${id}`)
    if (!lyricsRes.data || (!lyricsRes.data.content && typeof lyricsRes.data !== 'string')) return null
    if (typeof lyricsRes.data === 'string') return lyricsRes.data
    if (lyricsRes.data.content && Array.isArray(lyricsRes.data.content)) {
      return lyricsRes.data.content
        .map(block => (block.text || []).map(wordObj => wordObj.text).join(' '))
        .filter(line => line.trim().length > 0)
        .join('\n')
    }
    return null
  } catch {
    return null
  }
}

async function getLyricsFromMusixmatch(songName, artistName) {
  try {
    const artist = encodeURIComponent(artistName)
    const track = encodeURIComponent(songName)
    const res = await axios.get(`https://kerollosy.vercel.app/full?artist=${artist}&track=${track}`)
    if (!res.data) return null
    if (res.data.syncedLyrics && res.data.syncedLyrics.lyrics) return res.data.syncedLyrics.lyrics
    if (res.data.unsyncedLyrics && res.data.unsyncedLyrics.lyrics) return res.data.unsyncedLyrics.lyrics
    return null
  } catch {
    return null
  }
}

async function getLyricsFromNetease(songName, artistName) {
  try {
    const search = `${songName} ${artistName}`
    const searchRes = await axios.get('http://music.163.com/api/search/pc', {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9,fa;q=0.8",
        "Cache-Control": "max-age=0",
        "Sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
        "Sec-ch-ua-mobile": "?0",
        "Sec-ch-ua-platform": "\"Windows\"",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Cookie": "NMTID=00OAVK3xqDG726ITU6jopU6jF2yMk0AAAGCO8l1BA;",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
      },
      params: {
        limit: 1,
        type: 1,
        offset: 0,
        s: search
      }
    })
    if (!searchRes.data || !searchRes.data.result || !searchRes.data.result.songs || !searchRes.data.result.songs.length) return null
    const id = searchRes.data.result.songs[0].id
    const lyricsRes = await axios.get('http://music.163.com/api/song/lyric', {
      headers: {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9,fa;q=0.8",
        "Cache-Control": "max-age=0",
        "Sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
        "Sec-ch-ua-mobile": "?0",
        "Sec-ch-ua-platform": "\"Windows\"",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Cookie": "NMTID=00OAVK3xqDG726ITU6jopU6jF2yMk0AAAGCO8l1BA;",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
      },
      params: {
        id,
        lv: 1,
        tv: 1,
        rv: 1
      }
    })
    if (!lyricsRes.data || !lyricsRes.data.lrc || !lyricsRes.data.lrc.lyric) return null
    return lyricsRes.data.lrc.lyric
  } catch {
    return null
  }
}

async function getLyricsFromQQ(songName, artistName) {
  try {
    const search = `${songName} ${artistName}`
    const searchRes = await axios.get('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      params: {
        format: "json",
        inCharset: "utf8",
        outCharset: "utf8",
        platform: "yqq.json",
        new_json: 1,
        w: search
      }
    })
    if (!searchRes.data || !searchRes.data.data || !searchRes.data.data.song || !searchRes.data.data.song.list || !searchRes.data.data.song.list.length) return null
    const song = searchRes.data.data.song.list[0]
    const payload = {
      artist: song.singer.map(s => s.name),
      album: song.album.name,
      id: song.id,
      title: song.title
    }
    const lyricsRes = await axios.post('http://paxmusic.serv00.net/getQQLyrics.php', payload, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    if (!lyricsRes.data || typeof lyricsRes.data !== 'string' || !lyricsRes.data.trim()) return null
    return lyricsRes.data
  } catch {
    return null
  }
}

async function getLyricsFromOvh(songName, artistName) {
  try {
    const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`)
    if (res.data && res.data.lyrics) return res.data.lyrics
    return null
  } catch {
    return null
  }
}

export async function getBestLyrics(songName, artistName) {
  let lyrics = await getLyricsFromLRCLib(songName, artistName)
  if (lyrics) return lyrics
  lyrics = await getLyricsFromApple(songName, artistName)
  if (lyrics) return lyrics
  lyrics = await getLyricsFromMusixmatch(songName, artistName)
  if (lyrics) return lyrics
  lyrics = await getLyricsFromNetease(songName, artistName)
  if (lyrics) return lyrics
  lyrics = await getLyricsFromQQ(songName, artistName)
  if (lyrics) return lyrics
  lyrics = await getLyricsFromOvh(songName, artistName)
  if (lyrics) return lyrics
  return null
}