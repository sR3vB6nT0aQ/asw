import path from 'path'
import { mkdirSync, existsSync, statSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)
const TMP_DIR = path.resolve(process.cwd(), 'tmp')

export async function ytDlpDownload(url, id) {
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true })

  const output = path.join(TMP_DIR, `${id}-${Date.now()}.mp3`)
  const cmd = `yt-dlp -x --audio-format mp3 -o "${output}" "${url}"`

  await execPromise(cmd)

  const stat = statSync(output)
  if (stat.size === 0) throw new Error('Archivo descargado vacío')

  return { path: output }
}
