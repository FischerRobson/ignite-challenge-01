import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

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

  select() {

  }

  insert() {

  }

  update() {

  }

  delete() {

  }
}