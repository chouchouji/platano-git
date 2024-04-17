import { exec } from 'child_process'

/**
 * 运行命令
 * @param {string} command 命令
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: process.cwd(),
      },
      (err, stdout) => {
        if (err) {
          reject(err)
        } else {
          resolve(stdout)
        }
      },
    )
  })
}

export default runCommand
