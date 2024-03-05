import { WINDOWS_NT, WRITE_TIMEOUT } from "../constants/index.js"
import { appendFile } from 'fs/promises'

export const getTopProcessCommand = (os) => {
  switch(os) {
    case WINDOWS_NT: {
      return 'powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + \' \' + $_.CPU + \' \' + $_.WorkingSet }"'
    }
    default: return 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1'
  }
}

export const transformOutput = (output) => {
  return `${Math.floor(new Date().getTime() / 1000)} : ${output}`
}

export const getErrorMessage = (error) => {
  return error instanceof Error ? error.message : String(error)
}

export const writeToFile = async (filePath, output) => {
    try {
      await appendFile(filePath, output)
    }
    catch (error) {
      const errorMessage = getErrorMessage(error)
      throw Error(`Error writing to file: ${errorMessage}`);
    }
}

export const scheduleWriteToFile = (logFilePath, output) => {
  const timeout = output.text ? WRITE_TIMEOUT : 0
  setTimeout(async () => {
    timeout && await writeToFile(logFilePath, output.text);
    setTimeout(() => scheduleWriteToFile(logFilePath, output), timeout);
  }, 0);
};
