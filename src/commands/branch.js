const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const { formatBranch, updateBranch, getCurrentBranch } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject, isEmptyArray } = require('../utils/util')

const PROTECTED_BRANCHES = ['main', 'dev']

async function getSelectBranches(localBranch) {
  const choices = formatBranch(localBranch).filter((branch) => !PROTECTED_BRANCHES.includes(branch))

  if (isEmptyArray(choices)) {
    log.warning('没有可以删除的分支了')
    return undefined
  }

  const { selectBranches } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectBranches',
      message: '请选择你要在本地删除的分支',
      choices,
    },
  ])

  return selectBranches
}

async function fetchAllBranches() {
  await updateBranch()
  const branch = await runCommand('git branch -a')
  log.success(branch.trimEnd())
}

async function logLocalBranches() {
  log.warning('本地剩余分支如下：')
  const branch = await runCommand('git branch')
  log.success(branch.trimEnd())
}

function getBranchesWithoutOwn(selectBranches, localBranch) {
  const currentBranch = getCurrentBranch(localBranch)

  return selectBranches.filter((selectBranch) => currentBranch !== selectBranch)
}

async function deleteLocalBranches(localBranch) {
  const selectBranches = await getSelectBranches(localBranch)

  if (isEmptyArray(selectBranches)) {
    log.warning('未选择任何分支')
    return
  }

  const restBranches = getBranchesWithoutOwn(selectBranches, localBranch)
  const promises = restBranches.map((branch) => runCommand(`git branch -D ${branch}`))

  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      log.success(`分支 ${restBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`分支 ${restBranches[index]} 删除失败...`)
    }
  })

  await logLocalBranches()
}

async function deleteLocalAndRemoteBranches(localBranch) {
  const selectBranches = await getSelectBranches(localBranch)
  if (isEmptyArray(selectBranches)) {
    log.warning('未选择任何分支')
    return
  }

  await updateBranch()

  const allBranch = await runCommand('git branch -a')
  const restBranches = await getBranchesWithoutOwn(selectBranches, localBranch)

  const localPromises = restBranches.map((branch) => runCommand(`git branch -D ${branch}`))
  const remoteBranches = restBranches.filter((branch) => allBranch.includes(`origin/${branch}`))
  const remotePromises = remoteBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))

  const results = await Promise.allSettled([...localPromises, ...remotePromises])

  results.forEach((result, index) => {
    const idx = index <= restBranches.length - 1 ? index : index - restBranches.length
    const branch = index <= restBranches.length - 1 ? restBranches[idx] : remoteBranches[idx]

    if (result.status === 'fulfilled') {
      const text = index <= restBranches.length - 1 ? '本地' : '远端'
      log.success(`${text} 分支 ${branch} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`分支 ${branch} 删除失败...`)
    }
  })

  await logLocalBranches()
}

async function runBranchCommand(params) {
  const localBranch = await runCommand('git branch')

  if (isEmptyObject(params)) {
    log.success(localBranch.trimEnd())
    return
  }

  const { a, d, Dr } = params

  if (a) {
    await fetchAllBranches()
  } else if (d) {
    await deleteLocalBranches(localBranch)
  } else if (Dr) {
    await deleteLocalAndRemoteBranches(localBranch)
  }
}

module.exports = {
  runBranchCommand,
}
