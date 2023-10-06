import fs from 'fs'
import { parse } from 'csv'

const csvPath = new URL('./tasks.csv', import.meta.url)

const readStream = fs.createReadStream(csvPath)

const parser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // skip header line
})

async function csvImportStream() {
  console.log('Importing csv file...')

  const lines = readStream.pipe(parser)

  for await (const chunk of lines) {
    const [title, description] = chunk
    console.log(`Importing ${title} ${description}`)

    await fetch('https://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })

    await sleep(1000)
  }
}

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve, time)
  })
}

csvImportStream()