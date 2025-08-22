import fetch from 'node-fetch'

const downloadLimits = {
  audio: 15 * 1024 * 1024,
  video: 30 * 1024 * 1024,
  image: 10 * 1024 * 1024,
  doc: 10 * 1024 * 1024,
  default: 15 * 1024 * 1024
}

const typeMap = {
  1: 'audio',
  2: 'video',
  3: 'image',
  4: 'doc'
}

export async function isTooLarge(url, limitType) {
  const type = typeMap[limitType] || 'default'
  const maxSize = downloadLimits[type]
  const headResponse = await fetch(url, { method: 'HEAD' })
  const contentLength = parseInt(headResponse.headers.get('content-length') || '0')
  return contentLength > maxSize
}
