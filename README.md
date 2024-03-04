# simplified-top-cli

## Acceptance criteria

- Program uses system shell command output (see Hints) to retrieve process name, CPU, and memory usage details.
- Refresh rate is ten times per second.
- The program uses only the standard library; any third-party modules are prohibited.
- Each update will NOT start from the new line. It is always displayed only in one row.
- Once per minute program appends the output to the log file activityMonitor.log in the format <unixtime> : <process info>. If the file doesn't exist - the program creates it.
- Program supports Linux, macOS, and Windows operating systems.