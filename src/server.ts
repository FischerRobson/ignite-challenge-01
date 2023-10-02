import http from 'node:http'


const port = 3333

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { url, method } = req


})

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})