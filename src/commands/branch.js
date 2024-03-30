const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const { formatBranch, updateBranch, getCurrentBranch, getRemoteBranches } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject, isEmptyArray, isNotEmptyArray } = require('../utils/util')

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
      message: '请选择你要删除的分支',
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

async function logLocalBranches() {
  log.warning('本地剩余分支如下：')
  const branch = await runCommand('git branch')
  const [currentBranch, ...restBranches] = getLocalBranches(branch)
  log.success(currentBranch)
  if (isNotEmptyArray(restBranches)) {
    log.info(restBranches.join('\n').trimEnd())
  }
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

async function deleteRemoteBranches() {
  const remoteBranches = await getRemoteBranches()
  const choices = remoteBranches.filter((remoteBr) => !PROTECTED_BRANCHES.includes(remoteBr))

  if (isEmptyArray(choices)) {
    log.warning('没有可以删除的分支了')
    return
  }

  const { selectBranches } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectBranches',
      message: '请选择你要删除的分支',
      choices,
    },
  ])

  if (isEmptyArray(selectBranches)) {
    log.warning('未选择任何分支')
    return
  }

  const promises = selectBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))
  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      log.success(`远端 分支 ${selectBranches[index]} 删除成功 ✅`)
    } else if (result.status === 'rejected') {
      log.error(`远端 分支 ${selectBranches[index]} 删除失败...`)
    }
  })
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

async function updateBranchName(localBranch) {
  const choices = formatBranch(localBranch).filter((branch) => !PROTECTED_BRANCHES.includes(branch))

  if (isEmptyArray(choices)) {
    log.warning('没有可以重命名的分支了')
    return
  }

  const { selectBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectBranch',
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
    log.error('已存在同名分支 🔁')
    return
  }

  await runCommand(`git branch -m ${selectBranch} ${newBranch.trim()}`)
  log.success(`${selectBranch} 已经重命名为 ${newBranch.trim()} 🖊️`)

  await logLocalBranches()
}

async function runBranchCommand(params) {
  const localBranch = await runCommand('git branch')

  if (isEmptyObject(params)) {
    const [currentBranch, ...restBranches] = getLocalBranches(localBranch)
    log.success(currentBranch)
    if (isNotEmptyArray(restBranches)) {
      log.info(restBranches.join('\n').trimEnd())
    }
    return
  }

  const { a, d, Dr, r, m } = params

  if (a) {
    await fetchAllBranches()
  } else if (m) {
    await updateBranchName(localBranch)
  } else if (d) {
    await deleteLocalBranches(localBranch)
  } else if (r) {
    await deleteRemoteBranches()
  } else if (Dr) {
    await deleteLocalAndRemoteBranches(localBranch)
  }
}

module.exports = {
  runBranchCommand,
}
