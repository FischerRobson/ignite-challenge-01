import http from 'node:http'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { buildRoutePath } from './utils/build-route-path';
import { database } from './database/database';
import { Task } from './database/entities/task';

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: RegExp;
  handler: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    body: Object | string,
    requestOptions: { query: Object, params: { id?: string } }
  ) => void;
}

export const routes: Route[] = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res, body, requestOptions) => {
      const tasks = database.select('TASKS')
      res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res, body, requestOptions) => {
      const bodySchema = z.object({
        title: z.string(),
        description: z.string(),
      })

      const { title, description } = bodySchema.parse(body)

      const newTask: Task = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      }

      database.insert('TASKS', newTask)
      return res.writeHead(201).end(JSON.stringify(newTask));
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res, body, requestOptions) => {

    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res, body, requestOptions) => {
      const { params } = requestOptions
      const { id } = params

      if (id) {
        database.delete('TASKS', id)
        return res.writeHead(204).end()
      }

      return res.writeHead(400).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/completed'),
    handler: async (req, res, body, requestOptions) => {

    }
  }
]