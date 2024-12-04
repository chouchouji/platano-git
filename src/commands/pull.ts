import { x } from 'tinyexec'
import { ORIGIN } from '../constants'
import type { PullOptions } from '../types'
import { formatRemoteNames, getCurrentBranch, updateBranch } from '../utils/branch'
import { error, success, warning } from '../utils/log'
import { getSelectedRemoteName } from '../utils/remote'

/**
 * 把 `origin` 移动到数组末尾
 * @param {string[]} remoteNames 远端名称
 * @returns {string[]}
 */
function moveOriginToEnd(remoteNames: string[]) {
  const len = remoteNames.length
  if (len === 1 && remoteNames[0] === ORIGIN) {
    return remoteNames
  }

  let idx: number | undefined = undefined
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

export async function runPullCommand(options: PullOptions) {
  const args = ['pull']

  const { s } = options

  if (s) {
    await updateBranch()

    const { stdout: remoteNames } = await x('git', ['remote'])
    const remoteName = await getSelectedRemoteName(moveOriginToEnd(formatRemoteNames(remoteNames)))
    const currentBranch = await getCurrentBranch()

    args.push(remoteName, currentBranch)
  }

  const { stdout, stderr } = await x('git', args)

  const out = stdout.trim()
  if (out) {
    success(`The exec command is: git ${args.join(' ')}`)
    success(out)
  }

  const err = stderr.trim()
  if (!out && err) {
    warning(`The exec command is: git ${args.join(' ')}`)
    error(err)
  }
}
