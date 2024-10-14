import { rawlist } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { getCurrentBranch, formatBranch } from '@/utils/branch.js'
import { isEmptyObject, formatChoices } from '@/utils/util.js'
import { warning, error, success } from '@/utils/log.js'

/**
 * 获取想要合并的分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} branches 本地分支列表
 * @returns {(string | undefined)} 如果没有分支可以合并，返回undefined，否则返回所选分支
 */
async function getSelectLocalBranch(currentBranch, branches) {
  const choices = branches.filter((br) => br !== currentBranch)

  if (!choices.length) {
    return undefined
  }

  const selectLocalBranch = await rawlist({
    message: '请选择你要合并的分支名',
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
      warning('暂无可以合并的分支')
      return
    }

    if (mergedBranch === currentBranch) {
      warning('当前分支和要合并的分支名相同！')
      return
    }

    if (!branches.includes(mergedBranch)) {
      error('本地不存在此分支！')
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
        error(err)
      }
    }
  }
}
