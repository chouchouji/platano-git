const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const { formatBranch, updateBranch, getCurrentBranch, getRemoteBranches } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject, isEmptyArray, isNotEmptyArray } = require('../utils/util')

const PROTECTED_BRANCHES = ['main', 'dev']

/**
 * 获取删除的分支列表
 * @param {string} localBranch 本地分支
 * @param {string} currentBranch 当前分支
 * @returns {(string[] | undefined)} 如果没有可删除的分支，返回undefined，否则返回删除的分支列表
 */
async function getSelectBranches(localBranch, currentBranch) {
  const choices = formatBranch(localBranch).filter((branch) => ![...PROTECTED_BRANCHES, currentBranch].includes(branch))

  if (isEmptyArray(choices)) {
    return undefined
  }

  const { selectedBranches } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedBranches',
      message: '请选择你要删除的分支',
      choices,
    },
  ])

  return selectedBranches
}

/**
 * 获取所有分支
 */
async function fetchAllBranches() {
  await updateBranch()
  const branch = await runCommand('git branch -a')
  log.success(branch.trimEnd())
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
  log.warning('本地剩余分支如下：')
  const branch = await runCommand('git branch')
  const [currentBranch, ...restBranches] = getLocalBranches(branch)
  log.success(currentBranch)
  if (isNotEmptyArray(restBranches)) {
    log.info(restBranches.join('\n').trimEnd())
  }
}

async function deleteLocalBranches(localBranch, currentBranch) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    log.warning('没有可以删除的分支了')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    log.warning('未选择任何分支')
    return
  }

  const promises = selectedBranches.map((branch) => runCommand(`git branch -D ${branch}`))
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      log.success(`分支 ${selectedBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`分支 ${selectedBranches[index]} 删除失败...`)
    }
  })

  await logLocalBranches()
}

async function deleteRemoteBranches() {
  const remoteBranches = await getRemoteBranches()
  const choices = remoteBranches.filter((remoteBr) => !PROTECTED_BRANCHES.includes(remoteBr))

  if (isEmptyArray(choices)) {
    log.warning('没有可以删除的分支了')
    return
  }

  const { selectedBranches } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedBranches',
      message: '请选择你要删除的分支',
      choices,
    },
  ])

  if (isEmptyArray(selectedBranches)) {
    log.warning('未选择任何分支')
    return
  }

  const promises = selectedBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      log.success(`远端 分支 ${selectedBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`远端 分支 ${selectedBranches[index]} 删除失败...`)
    }
  })
}

async function deleteLocalAndRemoteBranches(localBranch, currentBranch) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    log.warning('没有可以删除的分支了')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    log.warning('未选择任何分支')
    return
  }

  await updateBranch()
  const allBranch = await runCommand('git branch -a')

  const localPromises = selectedBranches.map((branch) => runCommand(`git branch -D ${branch}`))
  const remoteBranches = selectedBranches.filter((branch) => allBranch.includes(`origin/${branch}`))
  const remotePromises = remoteBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))

  const results = await Promise.allSettled([...localPromises, ...remotePromises])

  results.forEach((result, index) => {
    const idx = index <= selectedBranches.length - 1 ? index : index - selectedBranches.length
    const branch = index <= selectedBranches.length - 1 ? selectedBranches[idx] : remoteBranches[idx]

    if (result.status === 'fulfilled') {
      const text = index <= selectedBranches.length - 1 ? '本地' : '远端'
      log.success(`${text} 分支 ${branch} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`分支 ${branch} 删除失败...`)
    }
  })

  await logLocalBranches()
}

/**
 * 获取基准分支和目标分支
 * @param {string[]} choices 本地分支列表
 * @returns {string[]} 返回基准分支和目标分支组成的数组
 */
async function getBaseAndTargetBranch(choices) {
  const { selectedBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedBranch',
      message: '请选择你要重命名的分支',
      choices,
    },
  ])

  const { newBranch } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newBranch',
      message: '请输入分支新名称',
    },
  ])

  return [selectedBranch, newBranch.trim()]
}

/**
 * 重命名分支
 * @param {string[]} branches 本地分支列表
 * @param {string | boolean} value m命名的值
 * @param {string} currentBranch 当前分支
 */
async function updateBranchName(branches, value, currentBranch) {
  const choices = branches.filter((branch) => !PROTECTED_BRANCHES.includes(branch))
  if (isEmptyArray(choices)) {
    log.warning('没有可以重命名的分支了')
    return
  }

  const [baseBranch, targetBranch] = value === true ? await getBaseAndTargetBranch(choices) : [currentBranch, value]

  if (PROTECTED_BRANCHES.includes(baseBranch)) {
    log.error('保护分支不能重命名 ❌')
    return
  }

  if (branches.includes(targetBranch)) {
    log.error('本地已存在同名分支 🔁')
    return
  }

  const remoteBranches = await getRemoteBranches()
  if (remoteBranches.includes(targetBranch)) {
    log.error('远端已存在同名分支 🔁')
    return
  }

  await runCommand(`git branch -m ${baseBranch} ${targetBranch}`)
  log.success(`${baseBranch} 已经重命名为 ${targetBranch} 🆕`)

  await logLocalBranches()
}

async function runBranchCommand(inputBranch, params) {
  const localBranch = await runCommand('git branch')
  const branches = formatBranch(localBranch)

  if (branches.includes(inputBranch)) {
    log.warning('本地已存在同名分支 🔁')
    return
  }

  if (typeof inputBranch === 'string' && inputBranch.length > 0) {
    await runCommand(`git branch ${inputBranch}`)
    log.success(`${inputBranch} 创建成功 🌈`)
    return
  }

  if (isEmptyObject(params) && inputBranch === undefined) {
    const [currentBranch, ...restBranches] = getLocalBranches(localBranch)
    log.success(currentBranch)
    if (isNotEmptyArray(restBranches)) {
      log.info(restBranches.join('\n').trimEnd())
    }
    return
  }

  const { a, d, Dr, r, m } = params
  const currentBranch = getCurrentBranch(localBranch)

  if (a) {
    await fetchAllBranches()
  } else if (m) {
    await updateBranchName(branches, m, currentBranch)
  } else if (d) {
    await deleteLocalBranches(localBranch, currentBranch)
  } else if (r) {
    await deleteRemoteBranches()
  } else if (Dr) {
    await deleteLocalAndRemoteBranches(localBranch, currentBranch)
  }
}

module.exports = {
  runBranchCommand,
}
