import { runCommand } from '../utils/run.js'
import { getCurrentBranch } from '../utils/branch.js'
import { success } from '../utils/log.js'
import { isEmptyObject } from '../utils/util.js'

export async function runPushCommand(params) {
  const branch = await runCommand('git branch')
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(params)) {
    await runCommand('git push')
    success('推送成功 🚀')
    return
  }

  const { u, f, o } = params
  if (u) {
    await runCommand(`git push --set-upstream origin ${currentBranch}`)
    success('关联远端并推送成功 🚀')
  } else if (f) {
    await runCommand(`git push origin ${currentBranch} -f`)
    success('强制推送成功 🚀')
  } else if (o) {
    await runCommand(`git push origin ${currentBranch}`)
    success('推送到远端成功 🚀')
  }
}
