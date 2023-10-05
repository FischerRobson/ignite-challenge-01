import http from 'node:http'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { buildRoutePath } from './utils/build-route-path';
import { database } from './database/database';
import { Task } from './database/entities/task';

interface Query {
  [key: string]: string | undefined;
}

interface Params {
  id: string;
}

interface Body {
  title?: string;
  description?: string;
}

interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: RegExp;
  handler: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    body: Body,
    requestOptions: {
      query: Query
      params: Params
    }
  ) => void;
}

export const routes: Route[] = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: async (req, res, body, requestOptions) => {
      const { query } = requestOptions

      const data = database.select('TASKS', query)
      res.end(JSON.stringify(data))
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
      try {
        const { title, description } = bodySchema.parse(body)
        const newTask: Task = {
          id: randomUUID(),
          title: title,
          description: description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        }

        database.insert('TASKS', newTask)
        return res.writeHead(201).end(JSON.stringify(newTask));
      } catch (err) {
        return res.writeHead(400).end(JSON.stringify({ error: 'missing field' }))
      }
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: async (req, res, body, requestOptions) => {
      const { params } = requestOptions;
      const { id } = params
      const { title, description } = body
      const task = database.selectById('TASKS', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'task not found' }))
      }

      const updatedTask: Task = {
        ...task,
        title: title || task.title,
        description: description || task.description,
        updated_at: new Date()
      }

      database.update('TASKS', id, updatedTask)
      return res.writeHead(204).end(JSON.stringify({ message: 'task updated' }))
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
      const { params } = requestOptions
      const { id } = params
      const task = database.selectById('TASKS', id)

      if (!task) {
        return res.writeHead(404).end(JSON.stringify({ error: 'task not found' }))
      }

      const updatedTask: Task = {
        ...task,
        completed_at: task.completed_at ? null : new Date(),
        updated_at: new Date()
      }

      database.update('TASKS', id, updatedTask)
      return res.writeHead(204).end(JSON.stringify({ message: 'task status updated' }))
    }
  }
]