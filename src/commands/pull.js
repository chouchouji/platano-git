import { x } from 'tinyexec'
import { success, error, warning } from '@/utils/log.js'
import { formatRemoteNames, getCurrentBranch, updateBranch } from '@/utils/branch.js'
import { getSelectedRemoteName } from '@/utils/remote.js'
import { ORIGIN } from '@/constants/remote.js'

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

export async function runPullCommand(params) {
  const args = ['pull']

  const { s } = params

  if (s) {
    await updateBranch()

    const { stdout: branch } = await x('git', ['branch'])
    const { stdout: remoteNames } = await x('git', ['remote'])
    const remoteName = await getSelectedRemoteName(moveOriginToEnd(formatRemoteNames(remoteNames)))
    const currentBranch = getCurrentBranch(branch)

    args.push(remoteName, currentBranch)
  }

  const { stdout, stderr } = await x('git', args)

  const out = stdout.trim()
  if (out) {
    success(`The exec command is: git ${args.join(' ')}`)
    success(out)
  }

  const err = stderr.trim()
  if (err) {
    warning(`The exec command is: git ${args.join(' ')}`)
    error(err)
  }
}
