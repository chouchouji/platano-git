import { input, select } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { getCurrentBranch, formatBranch } from '@/utils/branch.js'
import { warning, error, success } from '@/utils/log.js'
import { isEmptyObject, formatChoices, isEmptyArray } from '@/utils/util.js'

/**
 * 获取想要切换到的分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} branches 本地分支列表
 * @returns {(string | undefined)} 如果没有分支可以切换，返回undefined，否则返回所选分支
 */
async function getSelectLocalBranch(currentBranch, branches) {
  const choices = branches.filter((br) => br !== currentBranch)

  if (isEmptyArray(choices)) {
    return undefined
  }

  const selectLocalBranch = await select({
    message: 'Please select the branch you want to switch to',
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
    message: 'Please enter a new branch name',
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
    message: 'Please select the base branch',
    default: currentBranch,
    choices: formatChoices(choices),
  })

  return selectedBranch
}

export async function runSwitchCommand(inputBranch, options) {
  const { stdout: branch } = await x('git', ['branch'], {
    throwOnError: true,
  })
  const branches = formatBranch(branch)
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(options)) {
    const switchedBranch = inputBranch === undefined ? await getSelectLocalBranch(currentBranch, branches) : inputBranch

    if (switchedBranch === undefined) {
      warning('There is no branch to switch to')
      return
    }

    if (switchedBranch === currentBranch) {
      warning('The current branch and the branch to be switched have the same name!')
      return
    }

    if (!branches.includes(switchedBranch)) {
      error('This branch does not exist locally!')
      return
    }

    if (switchedBranch) {
      const { stdout, stderr } = await x('git', ['switch', switchedBranch], {
        throwOnError: true,
      })
      const out = stdout.trim()
      if (out) {
        success(`The exec command is: git switch ${switchedBranch}`)
        success(out)
      }

      const err = stderr.trim()
      if (err) {
        warning(`The exec command is: git switch ${switchedBranch}`)
        error(err)
      }
    }

    return
  }

  const { c, r } = options

  if (c) {
    let originBranches = []
    if (r) {
      await x('git', ['fetch', 'origin'], {
        throwOnError: true,
      })
      const { stdout: originBranch } = await x('git', ['branch', '-r'], {
        throwOnError: true,
      })
      originBranches = formatBranch(originBranch)
    }

    const baseBranch = await getBaseBranch(currentBranch, [...branches, ...originBranches])

    const newBranch = c === true ? await getInputBranchName() : c
    if (!newBranch) {
      error('Invalid branch name!')
      return
    }

    if (branches.includes(newBranch)) {
      error('A branch with the same name already exists locally 🔁')
      return
    }

    const { stdout, stderr } = await x('git', ['switch', '-c', newBranch, baseBranch], {
      throwOnError: true,
    })
    const out = stdout.trim()
    if (out) {
      success(`The exec command is: git switch -c ${newBranch} ${baseBranch}`)
      success(out)
    }

    const err = stderr.trim()
    if (err) {
      warning(`The exec command is: git switch -c ${newBranch} ${baseBranch}`)
      error(err)
    }
  }
}
