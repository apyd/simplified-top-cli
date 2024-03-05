import { spawn } from 'node:child_process';
import readline from 'node:readline';
import process from 'node:process';

import { 
  scheduleWriteToFile,
  getErrorMessage,
  transformOutput 
} from '../utils/index.js';

export const createTopProcess = async (pathToLogFile) => {
  let output = { text: '' }

  const topProcess = (cmd) => {
    const startTime = Date.now()
    const top = spawn(cmd, { shell: true })

    top.stdout.on('data', async (data) => {
      const timeElapsed = Date.now() - startTime
      const nextExecutionRun = timeElapsed > 100 ? 0 : 100 - timeElapsed

      setTimeout(() => topProcess(cmd), nextExecutionRun)

      try {
        output.text = transformOutput(data)
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw Error(`Error transforming output: ${errorMessage}`);
      }

      readline.cursorTo(process.stdout, 0, 0);
      readline.clearLine(process.stdout, 0);
      readline.clearScreenDown(process.stdout);

      process.stdout.write(data);
    })

    top.stderr.on('data', (data) => {
      throw Error(`Error reading top process data: ${data}`);
    })

    top.on('error', (error) => {
      const errorMessage = getErrorMessage(error)
      throw Error(`Error writing to file: ${errorMessage}`);
    });
  }

  scheduleWriteToFile(pathToLogFile, output);

  return topProcess 
}