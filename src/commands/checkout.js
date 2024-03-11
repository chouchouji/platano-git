const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const { getCurrentBranch, formatBranch } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject } = require('../utils/util')

async function getSelectLocalBranch(branch) {
  const currentBranch = getCurrentBranch(branch)
  const choices = formatBranch(branch).filter((br) => br !== currentBranch)

  if (!choices.length) {
    log.warning('暂无可以切换的分支')
    return undefined
  }

  const { selectLocalBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectLocalBranch',
      message: '请选择你要切换的分支名',
      choices,
    },
  ])

  return selectLocalBranch
}

async function getInputBranchName() {
  const { newBranch } = await inquirer.prompt([
    {
      type: 'input',
      name: 'newBranch',
      message: '请输入新分支名称',
    },
  ])

  return newBranch.trim()
}

async function getBaseBranch(branch) {
  const currentBranch = getCurrentBranch(branch)
  const choices = formatBranch(branch)

  const { selectBranch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectBranch',
      message: '请选择你的基准分支',
      default: currentBranch,
      choices,
    },
  ])

  return selectBranch
}

async function runCheckoutCommand(params) {
  const branch = await runCommand('git branch')

  if (isEmptyObject(params)) {
    const selectedBranch = await getSelectLocalBranch(branch)

    if (selectedBranch) {
      await runCommand(`git checkout ${selectedBranch}`)
      log.success(`成功切换到 ${selectedBranch} 🎉`)
    }

    return
  }

  const { b } = params

  if (b) {
    const newBranch = await getInputBranchName()

    if (!newBranch) {
      log.error('分支名无效！')
      return
    }

    if (branch.includes(newBranch)) {
      log.error('本地已存在同名分支！')
      return
    }

    const baseBranch = await getBaseBranch(branch)
    await runCommand(`git checkout -b ${newBranch} ${baseBranch}`)
    log.success(`${newBranch} 创建成功 🔧`)
  }
}

module.exports = {
  runCheckoutCommand,
}
