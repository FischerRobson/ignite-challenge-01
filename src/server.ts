import http from 'node:http'
import { jsonMiddleware } from './middlewares/json'

const port = 3333

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { url, method } = req

  const body = await jsonMiddleware(req, res)

})

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})