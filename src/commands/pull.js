const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const log = require('../utils/log')
const { getRemoteNames, getCurrentBranch, updateBranch } = require('../utils/branch')
const { isEmptyObject } = require('../utils/util')

async function getSelectRemoteName(branch) {
  const choices = getRemoteNames(branch)

  const { selectName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectName',
      message: '请选择你要拉取的远程名',
      default: 'origin',
      choices,
    },
  ])

  return selectName
}

async function runPullCommand(params) {
  if (isEmptyObject(params)) {
    await runCommand('git pull')
    log.success('拉取成功 ⬇️')
    return
  }

  const { s } = params

  if (s) {
    await updateBranch()

    const branch = await runCommand('git branch -a')
    const remoteName = await getSelectRemoteName(branch)
    const currentBranch = await getCurrentBranch(branch)

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    log.success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}

module.exports = {
  runPullCommand,
}
