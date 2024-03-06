const { runCommand } = require('../utils/run')
const log = require('../utils/log')
const { getRemoteNames, getCurrentBranch } = require('../utils/branch')
const inquirer = require('inquirer')
const { isEmptyObject } = require('../utils/util')

async function getSelectRemoteName() {
  await updateBranch()
  
  const res = await runCommand('git branch -a')
  const choices = getRemoteNames(res)

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
    const remoteName = await getSelectRemoteName()
    const branch = await runCommand('git branch -a')
    const currentBranch = await getCurrentBranch(branch)

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    log.success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}

module.exports = {
  runPullCommand,
}
