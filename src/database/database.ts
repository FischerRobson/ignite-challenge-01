import fs from 'node:fs/promises'
import { Task } from './entities/task';

const databasePath = new URL('../db.json', import.meta.url)

type Tables = 'TASKS'

interface SelectParams {
  id?: string;
  title?: string;
  description?: string;
}

class Database {
  #tables: {};

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#tables = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }


  // Write data in JSON
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#tables))
  }

  select(table: Tables, params?: SelectParams) {
    const data = this.#tables[table] ?? []

    if (params) {

    }

    return data
  }

  insert(table: Tables, data: Task) {
    if (Array.isArray(this.#tables[table])) {
      this.#tables[table].push(data)
    } else {
      this.#tables[table] = [data]
    }

    this.#persist()
  }

  update(table: Tables, id: string, data: Task) {
    const index = this.#tables[table]?.findIndex(row => row.id = id)
    if (index > -1) {
      this.#tables[table][index] = data
      this.#persist()
    }
  }

  delete(table: Tables, id: string) {
    const index = this.#tables[table]?.findIndex(row => row.id = id)
    if (index > -1) {
      this.#tables[table].splice(index, 1)
      this.#persist()
    }
  }
}

export const database = new Database()