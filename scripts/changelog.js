const { runCommand } = require('../src/utils/run')

async function generateChangeLog() {
  try {
    await runCommand('npm run changelog')
  } catch (error) {
    console.error('generate changeLog error', error)
  }
}

module.exports = {
  generateChangeLog,
}
