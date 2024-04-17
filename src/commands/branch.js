import inquirer from 'inquirer'

import runCommand from '../utils/run.js'
import { formatBranch, updateBranch, getCurrentBranch, getRemoteBranches } from '../utils/branch.js'
import { success, error, warning, info } from '../utils/log.js'
import { isEmptyObject, isEmptyArray, isNotEmptyArray } from '../utils/util.js'

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
  success(branch.trimEnd())
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
  warning('本地剩余分支如下：')
  const branch = await runCommand('git branch')
  const [currentBranch, ...restBranches] = getLocalBranches(branch)
  success(currentBranch)
  if (isNotEmptyArray(restBranches)) {
    info(restBranches.join('\n').trimEnd())
  }
}

async function deleteLocalBranches(localBranch, currentBranch) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    warning('没有可以删除的分支了')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    warning('未选择任何分支')
    return
  }

  const promises = selectedBranches.map((branch) => runCommand(`git branch -D ${branch}`))
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      success(`分支 ${selectedBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      error(`分支 ${selectedBranches[index]} 删除失败...`)
    }
  })

  await logLocalBranches()
}

async function deleteRemoteBranches() {
  const remoteBranches = await getRemoteBranches()
  const choices = remoteBranches.filter((remoteBr) => !PROTECTED_BRANCHES.includes(remoteBr))

  if (isEmptyArray(choices)) {
    warning('没有可以删除的分支了')
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
    warning('未选择任何分支')
    return
  }

  const promises = selectedBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      success(`远端 分支 ${selectedBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      error(`远端 分支 ${selectedBranches[index]} 删除失败...`)
    }
  })
}

async function deleteLocalAndRemoteBranches(localBranch, currentBranch) {
  const selectedBranches = await getSelectBranches(localBranch, currentBranch)

  if (selectedBranches === undefined) {
    warning('没有可以删除的分支了')
    return
  }

  if (isEmptyArray(selectedBranches)) {
    warning('未选择任何分支')
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
      success(`${text} 分支 ${branch} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      error(`分支 ${branch} 删除失败...`)
    }
  })

  await logLocalBranches()
}

async function updateBranchName(localBranch) {
  const choices = formatBranch(localBranch).filter((branch) => !PROTECTED_BRANCHES.includes(branch))

  if (isEmptyArray(choices)) {
    warning('没有可以重命名的分支了')
    return
  }

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

  const remoteBranches = await getRemoteBranches()
  const remoteChoices = remoteBranches.filter((remoteBr) => !PROTECTED_BRANCHES.includes(remoteBr))

  if ([...choices, ...remoteChoices].includes(newBranch.trim())) {
    error('已存在同名分支 🔁')
    return
  }

  await runCommand(`git branch -m ${selectedBranch} ${newBranch.trim()}`)
  success(`${selectedBranch} 已经重命名为 ${newBranch.trim()} 🖊️`)

  await logLocalBranches()
}

async function runBranchCommand(inputBranch, params) {
  const localBranch = await runCommand('git branch')
  const branches = formatBranch(localBranch)

  if (branches.includes(inputBranch) && isEmptyObject(params)) {
    warning('本地已存在同名分支 🔁')
    return
  }

  if (typeof inputBranch === 'string' && inputBranch.length > 0 && isEmptyObject(params)) {
    await runCommand(`git branch ${inputBranch}`)
    success(`${inputBranch} 创建成功 🌈`)
    return
  }

  if (inputBranch === undefined && isEmptyObject(params) ) {
    const [currentBranch, ...restBranches] = getLocalBranches(localBranch)
    success(currentBranch)
    if (isNotEmptyArray(restBranches)) {
      info(restBranches.join('\n').trimEnd())
    }
    return
  }

  const { a, d, Dr, r, m } = params
  const currentBranch = getCurrentBranch(localBranch)

  if (a) {
    await fetchAllBranches()
  } else if (m) {
    await updateBranchName(localBranch)
  } else if (d) {
    await deleteLocalBranches(localBranch, currentBranch)
  } else if (r) {
    await deleteRemoteBranches()
  } else if (Dr) {
    await deleteLocalAndRemoteBranches(localBranch, currentBranch)
  }
}

export default runBranchCommand
