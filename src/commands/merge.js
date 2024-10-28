import { select } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { getCurrentBranch, formatBranch } from '@/utils/branch.js'
import { isEmptyObject, formatChoices, isEmptyArray } from '@/utils/util.js'
import { warning, error, success } from '@/utils/log.js'

/**
 * 获取想要合并的分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} branches 本地分支列表
 * @returns {(string | undefined)} 如果没有分支可以合并，返回undefined，否则返回所选分支
 */
async function getSelectLocalBranch(currentBranch, branches) {
  const choices = branches.filter((br) => br !== currentBranch)

  if (isEmptyArray(choices)) {
    return undefined
  }

  const selectLocalBranch = await select({
    message: 'Please select the branch name you want to merge',
    choices: formatChoices(choices),
  })

  return selectLocalBranch
}

export async function runMergeCommand(inputBranch, options) {
  const { stdout: branch } = await x('git', ['branch'])
  const branches = formatBranch(branch)
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(options)) {
    const mergedBranch = inputBranch === undefined ? await getSelectLocalBranch(currentBranch, branches) : inputBranch

    if (mergedBranch === undefined) {
      warning('There are currently no branches that can be merged')
      return
    }

    if (mergedBranch === currentBranch) {
      warning('The current branch and the branch to be merged have the same name!')
      return
    }

    if (!branches.includes(mergedBranch)) {
      error('This branch does not exist locally!')
      return
    }

    if (mergedBranch) {
      const { stdout, stderr } = await x('git', ['merge', mergedBranch])
      const out = stdout.trim()
      if (out) {
        success(out)
      }

      const err = stderr.trim()
      if (err) {
        warning(`The exec command is: git merge ${mergedBranch}`)
        error(err)
      }
    }
  }
}
