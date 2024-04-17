import  inquirer from 'inquirer'

import runCommand from '../utils/run.js'
import { getRemoteNames, getCurrentBranch, updateBranch } from '../utils/branch.js'
import { success } from '../utils/log.js'
import { isEmptyObject } from '../utils/util.js'

/**
 * 获取要拉取的远程名
 * @param {string} branch 所有分支
 * @returns {string}
 */
async function getSelectedRemoteName(branch) {
  const choices = getRemoteNames(branch)

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
    success('拉取成功 ⬇️')
    return
  }

  const { s } = params

  if (s) {
    await updateBranch()

    const branch = await runCommand('git branch -a')
    const remoteName = await getSelectedRemoteName(branch)
    const currentBranch = getCurrentBranch(branch)

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}

export default runPullCommand
