import http from 'node:http'
import { parse } from 'csv'
import { jsonMiddleware } from './middlewares/json'
import { routes } from './routes'
import { extractRouteParams } from './utils/extract-route-params'

const port = 3333

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { url, method } = req

  const body = await jsonMiddleware(req, res)

  const route = routes.find(route => route.path.test(url!) && route.method === method)

  if (route) {
    const routeParams = url?.match(route.path)
    const { query, ...params } = routeParams?.groups as any

    const requestOptions = {
      query: query ? extractRouteParams(query) : {},
      params
    }

    return route.handler(req, res, body, requestOptions)
  }

  return res.writeHead(404).end()
})

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})