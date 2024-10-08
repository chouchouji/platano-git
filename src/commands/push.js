import { x } from 'tinyexec'
import { rawlist } from '@inquirer/prompts'
import { getCurrentBranch, updateBranch, formatRemoteNames } from '../utils/branch.js'
import { formatChoices } from '../utils/util.js'
import { success, error } from '../utils/log.js'

/**
 * 获取要推送的远程名
 * @param {string} remoteNames 远端名称
 * @returns {string}
 */
async function getSelectedRemoteName(remoteNames) {
  const choices = formatRemoteNames(remoteNames)

  const selectedName = await rawlist({
    message: '请选择你要推送的远程名',
    choices: formatChoices(choices),
  })

  return selectedName
}

export async function runPushCommand(params) {
  const { stdout: branch } = await x('git', ['branch'])
  const currentBranch = getCurrentBranch(branch)

  const args = ['push']

  const { u, f, s } = params
  if (u) {
    args.push('--set-upstream')
  }

  if (s) {
    await updateBranch()

    const { stdout: remoteNames } = await x('git', ['remote'])
    const remoteName = await getSelectedRemoteName(remoteNames)

    args.push(remoteName, currentBranch)
  } else {
    args.push('origin', currentBranch)
  }

  if (f) {
    args.push('-f')
  }

  const { stdout, stderr } = await x('git', args)

  const out = stdout.trim()
  if (out) {
    success(out)
  }

  const err = stderr.trim()
  if (err) {
    error(err)
  }
}
