import { exec } from 'child_process'
import { cwd } from 'process'

/**
 * 运行命令
 * @param {string} command 命令
 */
export async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: cwd(),
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
