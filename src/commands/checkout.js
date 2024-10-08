import { input, select, rawlist } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { getCurrentBranch, formatBranch } from '../utils/branch.js'
import { warning, error, success } from '../utils/log.js'
import { isEmptyObject, formatChoices } from '../utils/util.js'

/**
 * 获取想要切换到的分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} branches 本地分支列表
 * @returns {(string | undefined)} 如果没有分支可以切换，返回undefined，否则返回所选分支
 */
async function getSelectLocalBranch(currentBranch, branches) {
  const choices = branches.filter((br) => br !== currentBranch)

  if (!choices.length) {
    return undefined
  }

  const selectLocalBranch = await rawlist({
    message: '请选择你要切换的分支名',
    choices: formatChoices(choices),
  })

  return selectLocalBranch
}

/**
 * 获取输入的新分支
 * @returns {string}
 */
async function getInputBranchName() {
  const newBranch = await input({
    message: '请输入新分支名称',
  })

  return newBranch.trim()
}

/**
 * 获取创建分支的基准分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} choices 本地分支列表
 * @returns {string}
 */
async function getBaseBranch(currentBranch, choices) {
  const selectedBranch = await select({
    message: '请选择你的基准分支',
    default: currentBranch,
    choices: formatChoices(choices),
  })

  return selectedBranch
}

export async function runCheckoutCommand(inputBranch, options) {
  const { stdout: branch } = await x('git', ['branch'])
  const branches = formatBranch(branch)
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(options)) {
    const switchedBranch = inputBranch === undefined ? await getSelectLocalBranch(currentBranch, branches) : inputBranch

    if (switchedBranch === undefined) {
      warning('暂无可以切换的分支')
      return
    }

    if (switchedBranch === currentBranch) {
      warning('当前分支和要切换的分支名相同！')
      return
    }

    if (!branches.includes(switchedBranch)) {
      error('本地不存在此分支！')
      return
    }

    if (switchedBranch) {
      const { stdout, stderr } = await x('git', ['checkout', switchedBranch])
      const out = stdout.trim()
      if (out) {
        success(out)
      }

      const err = stderr.trim()
      if (err) {
        error(err)
      }
    }

    return
  }

  const { b } = options

  if (b) {
    const newBranch = b === true ? await getInputBranchName() : b

    if (!newBranch) {
      error('分支名无效！')
      return
    }

    if (branches.includes(newBranch)) {
      error('本地已存在同名分支 🔁')
      return
    }

    await x('git', ['fetch', 'origin'])
    const { stdout: originBranch } = await x('git', ['branch', '-r'])
    const originBranches = formatBranch(originBranch)

    const baseBranch = await getBaseBranch(currentBranch, [...branches, ...originBranches])
    const { stdout, stderr } = await x('git', ['checkout', '-b', newBranch, baseBranch])
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
