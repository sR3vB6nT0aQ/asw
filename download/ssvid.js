import axios from 'axios'
import qs from 'qs'

// --------- mantiene el export antiguo intacto ---------
const ssvid = {
  async download(url, forceType = 'video') {
    try {
      const res = await axios.post(
        'https://ssvid.net/api/ajax/search',
        qs.stringify({ query: url, vt: 'home' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )
      const data = res.data
      if (!data || data.status !== 'ok') {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const { title, a: author, t: duration, vid } = data
      const thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
      const formats = []
      for (const q in data.links?.mp4 || {}) {
        const v = data.links.mp4[q]
        formats.push({
          quality: v.q_text, size: v.size, format: v.f, type: 'video', k: v.k
        })
      }
      let selected = formats.find(f => f.quality.includes('360p')) || formats[0]
      if (!selected || !selected.k) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const conv = await axios.post(
        'https://ssvid.net/api/ajax/convert',
        qs.stringify({ vid, k: selected.k }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://ssvid.net/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
          }
        }
      )
      const converted = conv.data
      const downloadUrl = converted?.url || converted?.dlink
      if (!downloadUrl) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      return {
        autor: '🜲 ᵖᵃᵗᵒ',
        status: true,
        data: {
          title,
          author,
          duration,
          thumbnail,
          download: {
            url: downloadUrl,
            format: selected.format,
            quality: selected.quality,
            size: selected.size,
            type: selected.type
          },
          vid
        }
      }
    } catch {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
    }
  }
}

const ssvidmp3 = {
  async download(url) {
    try {
      const { data: search } = await axios.post(
        'https://ssvid.net/api/ajax/search?hl=en',
        qs.stringify({ query: url, cf_token: '', vt: 'home' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; moto g play) AppleWebKit/537.36'
          }
        }
      )
      if (search.status !== 'ok') {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const { title, a: author, t: duration, vid } = search
      const mp3Key = search.links?.mp3?.mp3128?.k
      if (!mp3Key) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const { data: conv } = await axios.post(
        'https://ssvid.net/api/ajax/convert?hl=en',
        qs.stringify({ vid, k: mp3Key }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13; moto g play) AppleWebKit/537.36'
          }
        }
      )
      const downloadUrl = conv?.dlink
      if (!downloadUrl) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }

      return {
        autor: '🜲 ᵖᵃᵗᵒ',
        status: true,
        data: {
          title,
          author,
          duration,
          thumbnail: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
          download: {
            url: downloadUrl,
            format: 'mp3',
            quality: '128kbps',
            size: search.links.mp3.mp3128.size,
            type: 'audio'
          },
          vid
        }
      }
    } catch {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
    }
  }
}

export default ssvid
export { ssvidmp3 }

/*import axios from 'axios'
import qs from 'qs'

const ssvid = {
  async download(url, forceType = 'video') {
    try {
      const res = await axios.post(
        'https://ssvid.net/api/ajax/search',
        qs.stringify({ query: url, vt: 'home' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      )
      const data = res.data
      if (!data || data.status !== 'ok') {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const { title, a: author, t: duration, vid } = data
      const thumbnail = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`
      const formats = []
      for (const q in data.links?.mp4 || {}) {
        const v = data.links.mp4[q]
        formats.push({
          quality: v.q_text, size: v.size, format: v.f, type: 'video', k: v.k
        })
      }
      let selected = formats.find(f => f.quality.includes('360p')) || formats[0]
      if (!selected || !selected.k) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      const conv = await axios.post(
        'https://ssvid.net/api/ajax/convert',
        qs.stringify({ vid, k: selected.k }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': 'https://ssvid.net/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10)'
          }
        }
      )
      const converted = conv.data
      const downloadUrl = converted?.url || converted?.dlink
      if (!downloadUrl) {
        return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
      }
      return {
        autor: '🜲 ᵖᵃᵗᵒ',
        status: true,
        data: {
          title,
          author,
          duration,
          thumbnail,
          download: {
            url: downloadUrl,
            format: selected.format,
            quality: selected.quality,
            size: selected.size,
            type: selected.type
          },
          vid
        }
      }
    } catch {
      return { autor: '🜲 ᵖᵃᵗᵒ', status: false, data: {} }
    }
  }
}

export default ssvid*/