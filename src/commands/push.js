const { runCommand } = require('../utils/run')
const { getCurrentBranch } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject } = require('../utils/util')

async function runPushCommand(params) {
  const branch = await runCommand('git branch')
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(params)) {
    await runCommand('git push')
    log.success('推送成功 🚀')
    return
  }

  const { u, f, o } = params
  if (u) {
    await runCommand(`git push --set-upstream origin ${currentBranch}`)
    log.success('关联远端并推送成功 🚀')
  } else if (f) {
    await runCommand('git push -f')
    log.success('强制推送成功 🚀')
  } else if (o) {
    await runCommand(`git push origin ${currentBranch}`)
    log.success('推送到远端成功 🚀')
  }
}

module.exports = {
  runPushCommand,
}
