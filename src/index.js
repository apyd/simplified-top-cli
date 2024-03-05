import { type } from 'node:os'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { spawn } from 'node:child_process'
import process from 'node:process'
import readline from 'node:readline'

import { getErrorMessage, getTopProcessCommand, transformOutput } from './utils/index.js'

import { LOG_FILE_NAME } from './constants/index.js'

let processId, writeFileId

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const command = getTopProcessCommand(type())

const createTopProcess = () => {
  let output = ''

  const topProcess = (cmd) => {
    const startTime = Date.now()
    const top = spawn(cmd, { shell: true })

    top.on('error', (error) => {
      const errorMessage = getErrorMessage(error)
      console.error(`Error writing to file: ${errorMessage}`);
    });

    top.stdout.on('data', async (data) => {
      const timeElapsed = Date.now() - startTime
      const nextExecutionRun = timeElapsed > 100 ? 0 : 100 - timeElapsed

      processId = setTimeout(() => topProcess(cmd), nextExecutionRun)

      try {
        output = transformOutput(data)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        console.error(`Error transforming output: ${errorMessage}`);
      }

      readline.cursorTo(process.stdout, 0, 0);
      readline.clearLine(process.stdout, 0);
      readline.clearScreenDown(process.stdout);

      process.stdout.write(data);
    })

    top.stderr.on('data', (data) => {
      console.error(`Error reading top process data: ${data}`);
    })
  }

  writeFileId = setInterval(async() => {
    try {
      await writeFile(join(__dirname, '..', LOG_FILE_NAME), output)
    }
    catch (error) {
      const errorMessage = getErrorMessage(error)
      console.error(`Error writing to file: ${errorMessage}`);
    }}, 60000)

  return topProcess
}

const topProcess = createTopProcess()
topProcess(command)

process.on('SIGINT', () => {
  clearTimeout(processId)
  clearInterval(writeFileId)
  process.exit()
})
