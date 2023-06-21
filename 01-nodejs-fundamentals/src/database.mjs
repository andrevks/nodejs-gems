import { readFile, writeFile } from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  async boot() {
    try {
      const data = await readFile(databasePath, 'utf-8')
      this.#database = JSON.parse(data)
    } catch (error) {
      await this.#persist()
    }
  }

  async #persist() {
    await writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  async insert(table, data) {
    const isTableExists = Array.isArray(this.#database[table])
    if (isTableExists) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    await this.#persist()

    return data
  }

  async delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex(data => data.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      await this.#persist()
    }
  }

  async update(table, id, data) {
    const rowIndex = this.#database[table]?.findIndex(data => data.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      await this.#persist()
    }
  }

}