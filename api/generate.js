import axios from 'axios'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' })

  const { prompt, style, size } = req.body

  const stylePrompt = {
    default: '-style Realism',
    ghibli: '-style Ghibli Art',
    cyberpunk: '-style Cyberpunk',
    anime: '-style Anime',
    portrait: '-style Portrait',
    chibi: '-style Chibi',
    'pixel art': '-style Pixel Art',
    'oil painting': '-style Oil Painting',
    '3d': '-style 3D'
  }

  const sizeList = {
    '1:1': '1024x1024',
    '3:2': '1080x720',
    '2:3': '720x1080'
  }

  if (!prompt || !style || !size) {
    return res.status(400).json({ error: 'Input tidak lengkap' })
  }

  if (!stylePrompt[style] || !sizeList[size]) {
    return res.status(400).json({ error: 'Style atau size tidak valid' })
  }

  const headers = {
    'content-type': 'application/json',
    origin: 'https://deepimg.ai',
    referer: 'https://deepimg.ai/'
  }

  const device_id = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  const payload = {
    device_id,
    prompt: `${prompt} ${stylePrompt[style]}`,
    size: sizeList[size],
    n: '1',
    output_format: 'png'
  }

  try {
    const response = await axios.post('https://api-preview.apirouter.ai/api/v1/deepimg/flux-1-dev', payload, { headers })
    const imageUrl = response.data?.data?.images?.[0]?.url
    if (!imageUrl) throw new Error('URL gambar tidak ditemukan')
    res.status(200).json({ url: imageUrl })
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal memproses' })
  }
}
