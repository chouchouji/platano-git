import { search } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { formatBranch, getCurrentBranch } from '../utils/branch'
import { error, success, warning } from '../utils/log'
import { isEmptyArray } from '../utils/util'

/**
 * 获取想要合并的分支
 * @param {string[]} branches 本地分支列表(不包含当前分支)
 * @returns {(string | undefined)} 如果没有分支可以合并，返回undefined，否则返回所选分支
 */
async function getSelectLocalBranch(localBranches: string[]) {
  if (isEmptyArray(localBranches)) {
    return undefined
  }

  const branch = await search<string>({
    message: 'Please select the branch name you want to merge',
    source: (input) => {
      if (!input) {
        return localBranches
      }

      return localBranches.filter((branch) => branch.includes(input))
    },
  })

  return branch
}

export async function runMergeCommand(inputBranch: string | undefined) {
  const currentBranch = await getCurrentBranch()
  const { stdout: branch } = await x('git', ['branch'])
  const localBranches = formatBranch(branch).filter((br) => br !== currentBranch)

  const mergedBranch = inputBranch === undefined ? await getSelectLocalBranch(localBranches) : inputBranch

  if (mergedBranch === undefined) {
    warning('There are currently no branches that can be merged')
    return
  }

  if (mergedBranch === currentBranch) {
    warning('The current branch and the branch to be merged have the same name!')
    return
  }

  if (!localBranches.includes(mergedBranch)) {
    error('This branch does not exist locally!')
    return
  }

  const { stdout, stderr } = await x('git', ['merge', mergedBranch])
  const out = stdout.trim()
  if (out) {
    success(`The exec command is: git merge ${mergedBranch}`)
    success(out)
  }

  const err = stderr.trim()
  if (!out && err) {
    warning(`The exec command is: git merge ${mergedBranch}`)
    error(err)
  }
}
