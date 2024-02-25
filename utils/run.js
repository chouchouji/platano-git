const { exec } = require("child_process");

async function runCommand(command) {
  return new Promise(async function (resolve, reject) {
    exec(
      command,
      {
        cwd: process.cwd(),
      },
      async function (err, stdout) {
        if (err) {
          reject(err);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

module.exports = {
  runCommand,
};
