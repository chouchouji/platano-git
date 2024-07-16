const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const log = require('../utils/log')
const { formatRemoteNames, getCurrentBranch, updateBranch } = require('../utils/branch')
const { isEmptyObject } = require('../utils/util')

/**
 * 获取要拉取的远程名
 * @param {string} branch 所有分支
 * @returns {string}
 */
async function getSelectedRemoteName(branch) {
  const choices = formatRemoteNames(branch)

  const { selectedName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedName',
      message: '请选择你要拉取的远程名',
      default: 'origin',
      choices,
    },
  ])

  return selectedName
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
    const remoteNames = await runCommand('git remote')
    const remoteName = await getSelectedRemoteName(remoteNames)
    const currentBranch = getCurrentBranch(branch)

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    log.success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}

module.exports = {
  runPullCommand,
}
