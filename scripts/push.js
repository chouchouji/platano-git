const { runCommand } = require('../src/utils/run')

async function push() {
  try {
    const version = await runCommand('npm view platano-git version')

    await runCommand('git add .')
    await runCommand(`git commit -m "v${version}"`)

    await runCommand(`git tag v${version}`)
    await runCommand(`git push origin v${version}`)

    await runCommand('git push')
  } catch (error) {
    console.error('push error', error)
  }
}

module.exports = {
  push,
}
