const { exec } = require('child_process')

/**
 * 运行命令
 * @param {string} command 命令
 */
async function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      {
        cwd: process.cwd(),
      },
      async (err, stdout) => {
        if (err) {
          reject(err)
        } else {
          resolve(stdout)
        }
      },
    )
  })
}

module.exports = {
  runCommand,
}
