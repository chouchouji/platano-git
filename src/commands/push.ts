import { x } from 'tinyexec'
import type { PushOptions } from '../types'
import { formatRemoteNames, getCurrentBranch, updateBranch } from '../utils/branch'
import { error, success, warning } from '../utils/log'
import { getSelectedRemoteName } from '../utils/remote'

export async function runPushCommand(options: PushOptions) {
  const currentBranch = await getCurrentBranch()

  const args = ['push']

  const { u, f, s } = options
  if (u) {
    args.push('--set-upstream')
  }

  if (s) {
    await updateBranch()

    const { stdout: remoteNames } = await x('git', ['remote'])
    const remoteName = await getSelectedRemoteName(formatRemoteNames(remoteNames))

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
    success(`The exec command is: git ${args.join(' ')}`)
    success(out)
  }

  const err = stderr.trim()
  if (!out && err) {
    warning(`The exec command is: git ${args.join(' ')}`)
    error(err)
  }
}
