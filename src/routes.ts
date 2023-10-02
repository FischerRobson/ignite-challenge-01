import http from 'node:http'
import { buildRoutePath } from './utils/build-route-path';

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: RegExp;
  handler: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    body: Object | string,
    requestOptions: { query: Object, params: [] }
  ) => void;
}

export const routes: Route[] = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res, body, requestOptions) => {
      res.writeHead(200).end(JSON.stringify({ message: 'OK' }));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res, body, requestOptions) => {

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks'),
    handler: (req, res, body, requestOptions) => {

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks'),
    handler: (req, res, body, requestOptions) => {

    }
  }
]