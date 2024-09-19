import { rawlist } from '@inquirer/prompts'
import { runCommand } from '../utils/run.js'
import { success } from '../utils/log.js'
import { formatRemoteNames, getCurrentBranch, updateBranch } from '../utils/branch.js'
import { isEmptyObject, formatChoices } from '../utils/util.js'
import { ORIGIN } from '../constants/remote.js'

/**
 * 把 `origin` 移动到数组末尾
 * @param {string[]} remoteNames 远端名称
 * @returns {string[]}
 */
function moveOriginToEnd(remoteNames) {
  const len = remoteNames.length
  if (len === 1 && remoteNames[0] === ORIGIN) {
    return remoteNames
  }

  let idx
  for (let i = 0; i < len; i++) {
    if (remoteNames[i] === ORIGIN) {
      idx = i
      continue
    }

    if (idx !== undefined) {
      remoteNames[idx] = remoteNames[i]
      idx += 1
    }
  }

  remoteNames[len - 1] = ORIGIN

  return remoteNames
}

/**
 * 获取要拉取的远程名
 * @param {string} remoteNames 远端名称
 * @returns {string}
 */
async function getSelectedRemoteName(remoteNames) {
  const choices = moveOriginToEnd(formatRemoteNames(remoteNames))

  const selectedName = await rawlist({
    message: '请选择你要拉取的远程名',
    choices: formatChoices(choices),
  })

  return selectedName
}

export async function runPullCommand(params) {
  if (isEmptyObject(params)) {
    await runCommand('git pull')
    success('拉取成功 ⬇️')
    return
  }

  const { s } = params

  if (s) {
    await updateBranch()

    const branch = await runCommand('git branch')
    const remoteNames = await runCommand('git remote')
    const remoteName = await getSelectedRemoteName(remoteNames)
    const currentBranch = getCurrentBranch(branch)

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}
