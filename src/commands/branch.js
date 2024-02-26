const { runCommand } = require('../utils/run')
const { formatBranch } = require('../utils/branch')
const inquirer = require('inquirer')
const log = require('../utils/log')
const { isEmptyObject, isEmptyArray } = require('../utils/util')

const PROTECTED_BRANCHES = ['main', 'dev']

async function getSelectBranches() {
  const res = await runCommand('git branch')
  const choices = formatBranch(res).filter((branch) => !PROTECTED_BRANCHES.includes(branch))

  if (isEmptyArray(choices)) {
    log.warning('没有可以删除的分支了')
    return []
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
  const branch = await runCommand('git branch -a')
  log.success(branch.trimEnd())
}

async function fetchLocalBranches() {
  const branch = await runCommand('git branch')
  log.success(branch.trimEnd())
}

async function deleteLocalBranches() {
  const selectBranches = await getSelectBranches()
  if (isEmptyArray(selectBranches)) {
    return
  }

  const promises = selectBranches.map((branch) => {
    runCommand(`git branch -D ${branch}`)
  })

  const results = await Promise.allSettled(promises)

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      log.success(`分支 ${selectBranches[index]} 删除成功!`)
    } else if (result.status === 'rejected') {
      log.error(`分支 ${selectBranches[index]} 删除失败。`)
    }
  })
}

async function deleteLocalAndRemoteBranches() {
  const selectBranches = await getSelectBranches()
  if (isEmptyArray(selectBranches)) {
    return
  }

  const localPromises = selectBranches.map((branch) => runCommand(`git branch -D ${branch}`))
  const remotePromises = selectBranches.map((branch) => runCommand(`git push origin --delete ${branch}`))

  await Promise.allSettled([...localPromises, ...remotePromises])
}

async function runBranchCommand(params) {
  if (isEmptyObject(params)) {
    await fetchLocalBranches()
    return
  }

  const { a, d, dr } = params
  if (a) {
    await fetchAllBranches()
  } else if (d) {
    await deleteLocalBranches()
  } else if (dr) {
    await deleteLocalAndRemoteBranches()
  }
}

module.exports = {
  runBranchCommand,
}
