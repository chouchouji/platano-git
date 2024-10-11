import { x } from 'tinyexec'
import { getCurrentBranch, updateBranch, formatRemoteNames } from '@/utils/branch.js'
import { success, error } from '@/utils/log.js'
import { getSelectedRemoteName } from '@/utils/remote.js'

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
    success(out)
  }

  const err = stderr.trim()
  if (err) {
    error(err)
  }
}
