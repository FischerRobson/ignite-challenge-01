import http from 'node:http'

export async function jsonMiddleware(req: http.IncomingMessage, res: http.ServerResponse) {
  const buffers: Uint8Array[] = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  res.setHeader('Content-Type', 'application/json')

  try {
    const body = JSON.parse(Buffer.concat(buffers).toString())
    return body
  } catch (err) {
    return null
  }
}