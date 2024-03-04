export const getTopProcessCommand = (os) => {
  switch(os) {
    case 'WINDOWS_NT': {
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