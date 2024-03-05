import { type } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { createTopProcess } from './commands/topProcess.js'
import { getTopProcessCommand } from './utils/index.js'

import { LOG_FILE_NAME } from './constants/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logFilePath = join(__dirname, '..', LOG_FILE_NAME)

const command = getTopProcessCommand(type())
const topProcess = await createTopProcess(logFilePath)

topProcess(command)