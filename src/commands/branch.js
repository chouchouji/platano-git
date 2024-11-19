import { checkbox, input, select } from '@inquirer/prompts'
import { x } from 'tinyexec'
import { isNonEmptyArray } from 'rattail'
import { formatBranch, updateBranch, formatRemoteNames, getCurrentBranch, getRemoteBranches } from '@/utils/branch.js'
import { success, warning, info, error } from '@/utils/log.js'
import { isEmptyObject, isEmptyArray, formatChoices } from '@/utils/util.js'
import { getSelectedRemoteName } from '@/utils/remote.js'
import { ORIGIN } from '@/constants/remote.js'

const PROTECTED_BRANCHES = ['main', 'dev']

/**
 * 获取删除的分支列表
 * @param {string} localBranch 本地分支
 * @param {string} currentBranch 当前分支
 * @returns {(string[] | undefined)} 如果没有可删除的分支，返回undefined，否则返回删除的分支列表
 */
async function getSelectBranches(localBranch, currentBranch) {
  const choices = formatBranch(localBranch).filter((branch) => ![currentBranch].includes(branch))

  if (isEmptyArray(choices)) {
    return undefined
  }

  const selectedBranches = await checkbox({
    message: 'Please select the branch you want to delete',
    choices: formatChoices(choices),
  })

  return selectedBranches
}

/**
 * 获取所有分支
 */
async function fetchAllBranches() {
  await updateBranch()
  const { stdout, stderr } = await x('git', ['branch', '-a'], {
    throwOnError: true,
  })
  const out = stdout.trimEnd()
  if (out) {
    success('The exec command is: git branch -a')
    success(out)
  }

  const err = stderr.trim()
  if (err) {
    warning('The exec command is: git branch -a')
    error(err)
  }
}

/**
 * 获取本地所有分支
 * @param {string} branch 本地分支
 * @returns {string[]}
 */
function getLocalBranches(branch) {
  const branches = branch
    .split('\n')
    .filter((br) => !br.includes('->'))
    .map((br) => br.trim())
    .filter(Boolean)

  const [currentBranch] = branches.filter((br) => br.includes('*'))
  const restBranches = branches.filter((br) => br !== currentBranch).map((br) => `  ${br}`)

  return [currentBranch, ...restBranches]
}

/**
 * 控制台输出本地剩余分支
 */
async function logLocalBranches() {
  warning('The remaining local branches are as follows:')
  const { stdout: branch } = await x('git', ['branch'], {
    throwOnError: true,
  })
  const [currentBranch, ...restBranches] = getLocalBranches(branch)
  success(currentBranch)
  if (isNonEmptyArray(restBranches)) {
    info(restBranches.join('\n').trimEnd())
  }
}

async function deleteLocalBranches(localBranch, currentBranch) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    warning('There are no branches to delete.')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    warning('No branch selected')
    return
  }

  const promises = selectedBranches.map((branch) => {
    const args = ['branch', '-D', branch]
    return x('git', args, {
      throwOnError: true,
    })
  })
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      success(`The exec command is: git branch -D ${selectedBranches[index]}`)
      success(`Branch ${selectedBranches[index]} deleted successfully ✅`)
    } else if (result.status === 'rejected') {
      warning(`The exec command is: git branch -D ${selectedBranches[index]}`)
      error(`Branch ${selectedBranches[index]} deleted failed...`)
    }
  })

  await logLocalBranches()
}

async function deleteRemoteBranches(remoteName) {
  const remoteBranches = await getRemoteBranches(remoteName)
  const choices = remoteBranches.filter((remoteBr) => !PROTECTED_BRANCHES.includes(remoteBr))

  if (isEmptyArray(choices)) {
    warning('There are no branches to delete.')
    return
  }

  const selectedBranches = await checkbox({
    message: 'Please select the branch you want to delete',
    choices: formatChoices(choices),
  })

  if (isEmptyArray(selectedBranches)) {
    warning('No branch selected')
    return
  }

  const promises = selectedBranches.map((branch) => {
    const args = ['push', remoteName, '--delete', branch]
    return x('git', args, {
      throwOnError: true,
    })
  })
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      success(`The exec command is: git push ${remoteName} --delete ${selectedBranches[index]}`)
      success(`${remoteName}/${selectedBranches[index]} deleted successfully ✅`)
    } else if (result.status === 'rejected') {
      warning(`The exec command is: git push ${remoteName} --delete ${selectedBranches[index]}`)
      error(`${remoteName}/${selectedBranches[index]} deleted failed...`)
    }
  })
}

async function deleteLocalAndRemoteBranches(localBranch, currentBranch, remoteName) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    warning('There are no branches to delete.')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    warning('No branch selected')
    return
  }

  await updateBranch()
  const { stdout: allBranch } = await x('git', ['branch', '-a'], {
    throwOnError: true,
  })

  const localPromises = selectedBranches.map((branch) => {
    const args = ['branch', '-D', branch]
    return x('git', args, {
      throwOnError: true,
    })
  })
  const remoteBranches = selectedBranches.filter((branch) => allBranch.includes(`${remoteName}/${branch}`))
  const remotePromises = remoteBranches.map((branch) => {
    const args = ['push', remoteName, '--delete', branch]
    return x('git', args, {
      throwOnError: true,
    })
  })

  const results = await Promise.allSettled([...localPromises, ...remotePromises])

  results.forEach((result, index) => {
    const isLocal = index <= selectedBranches.length - 1
    const idx = isLocal ? index : index - selectedBranches.length
    const branch = isLocal ? selectedBranches[idx] : remoteBranches[idx]

    const text = isLocal ? `Local branch ${branch}` : `${remoteName}/${branch}`
    const commandText = isLocal ? `git branch -D ${branch}` : `git push ${remoteName} --delete ${branch}`

    if (result.status === 'fulfilled') {
      success(`The exec command is: ${commandText}`)
      success(`${text} deleted successfully ✅`)
    } else if (result.status === 'rejected') {
      warning(`The exec command is: ${commandText}`)
      error(`${text} deleted failed...`)
    }
  })

  await logLocalBranches()
}

/**
 * 获取基准分支和目标分支
 * @param {string} currentBranch 当前分支
 * @param {string[]} choices 本地分支列表
 * @returns {string[]} 返回基准分支和目标分支组成的数组
 */
async function getBaseAndTargetBranch(currentBranch, choices) {
  const selectedBranch = await select({
    message: 'Please select the local branch you want to rename',
    default: currentBranch,
    choices: formatChoices(choices),
  })

  const newBranch = await input({
    message: 'Please enter a new branch name',
  })

  return [selectedBranch, newBranch.trim()]
}

/**
 * 重命名分支
 * @param {string[]} branches 本地分支列表
 * @param {string | boolean} value 命名的值
 * @param {string} currentBranch 当前分支
 */
async function updateBranchName(branches, value, currentBranch) {
  const choices = branches.filter((branch) => !PROTECTED_BRANCHES.includes(branch))
  if (isEmptyArray(choices)) {
    warning('There are no more branches to rename.')
    return
  }

  const [baseBranch, targetBranch] =
    value === true ? await getBaseAndTargetBranch(currentBranch, choices) : [currentBranch, value]

  if (PROTECTED_BRANCHES.includes(baseBranch)) {
    error('Protect branches from being renamed ❌')
    return
  }

  if (branches.includes(targetBranch)) {
    error('A branch with the same name already exists locally 🔁')
    return
  }

  const { stdout, stderr } = await x('git', ['branch', '-m', baseBranch, targetBranch], {
    throwOnError: true,
  })
  const out = stdout.trim()
  if (out) {
    success(`The exec command is git branch -m ${baseBranch} ${targetBranch}`)
    success(out)
  }

  const err = stderr.trim()
  if (err) {
    warning(`The exec command is git branch -m ${baseBranch} ${targetBranch}`)
    error(err)
  }

  await logLocalBranches()
}

export async function runBranchCommand(inputBranch, params) {
  const { stdout: localBranch } = await x('git', ['branch'], {
    throwOnError: true,
  })
  const branches = formatBranch(localBranch)

  if (branches.includes(inputBranch)) {
    warning('A branch with the same name already exists locally 🔁')
    return
  }

  if (typeof inputBranch === 'string' && inputBranch.length > 0) {
    const { stdout, stderr } = await x('git', ['branch', inputBranch], {
      throwOnError: true,
    })
    const out = stdout.trim()
    if (out) {
      success(`The exec command is git branch ${inputBranch}`)
      success(out)
    }

    const err = stderr.trim()
    if (err) {
      warning(`The exec command is git branch ${inputBranch}`)
      error(err)
    }
    return
  }

  if (isEmptyObject(params) && inputBranch === undefined) {
    const [currentBranch, ...restBranches] = getLocalBranches(localBranch)
    success(currentBranch)
    if (isNonEmptyArray(restBranches)) {
      info(restBranches.join('\n').trimEnd())
    }
    return
  }

  const { a, d, Dr, r, m, s } = params
  const currentBranch = getCurrentBranch(localBranch)

  let remoteName = ORIGIN

  if (s) {
    const { stdout: remoteNames } = await x('git', ['remote'], {
      throwOnError: true,
    })
    remoteName = await getSelectedRemoteName(formatRemoteNames(remoteNames))
  }

  if (a) {
    await fetchAllBranches()
  }
  if (m) {
    await updateBranchName(branches, m, currentBranch)
  }
  if (d) {
    await deleteLocalBranches(localBranch, currentBranch)
  }
  if (r) {
    await deleteRemoteBranches(remoteName)
  }
  if (Dr) {
    await deleteLocalAndRemoteBranches(localBranch, currentBranch, remoteName)
  }
}
