import fs from 'node:fs/promises'
import { Task } from './entities/task';

const databasePath = new URL('../db.json', import.meta.url)

type Tables = 'TASKS'

interface SelectParams {
  [key: string]: string | undefined;
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

  select(table: Tables, params: SelectParams | null = null) {
    let t: Task[] = this.#tables[table] ?? []

    if (params && Object.entries(params).length > 0) {
      t = t.filter(t => {
        return Object.entries(params)
          .some(([key, value]) => {
            return t[key].toLocaleLowerCase().includes(value?.toLocaleLowerCase()) // t[key] == t.key
          })
      })
    }

    return t
  }

  selectById(table: Tables, id: string) {
    const t: Task[] = this.#tables[table] ?? []
    const data = t.find(row => row.id === id)
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