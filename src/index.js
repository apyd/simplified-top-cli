import { type } from 'node:os'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
import process from 'node:process'
import readline from 'node:readline'

import { getTopProcessCommand, transformOutput } from './utils/index.js'

import { LOG_FILE_NAME } from './constants/index.js'

let processId, writeFileId

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const command = getTopProcessCommand(type())

const createTopProcess = () => {
  let output = ''

  const topProcess = (cmd) => {
    const top = spawn(cmd, { shell: true })

    top.stdout.on('data', async (data) => {
      output = transformOutput(data)

      readline.cursorTo(process.stdout, 0, 0);
      readline.clearLine(process.stdout, 0);
      readline.clearScreenDown(process.stdout);

      process.stdout.write(data);
    })

    top.stderr.on('data', (data) => {
      throw new Error(data)
    })
  }

  writeFileId = setInterval(async() => {
    await writeFile(join(__dirname, '..', LOG_FILE_NAME), output, err => {
      if (err) {
        throw new Error(err)
      }
    })}, 60000)

  return topProcess
}

const topProcess = createTopProcess()

processId = setInterval(() => {
  topProcess(command)
}, 100);

process.on('SIGINT', () => {
  clearInterval(processId)
  clearInterval(writeFileId)
  process.exit()
})
