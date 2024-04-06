const inquirer = require('inquirer')
const { runCommand } = require('../utils/run')
const { getCurrentBranch, formatBranch } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject, isString } = require('../utils/util')

async function getSelectLocalBranch(currentBranch, branches) {
  const choices = branches.filter((br) => br !== currentBranch)

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

async function getBaseBranch(currentBranch, choices) {
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
  const branches = formatBranch(branch)
  const currentBranch = getCurrentBranch(branch)

  if (isEmptyObject(params) || (isString(params) && params.length > 0)) {
    const selectedBranch = isEmptyObject(params) ? await getSelectLocalBranch(currentBranch, branches) : params

    if (params === currentBranch) {
      log.warning('当前分支和要切换的分支名相同')
      return
    }

    if (selectedBranch) {
      await runCommand(`git checkout ${selectedBranch}`)
      log.success(`成功切换到 ${selectedBranch} 🎉`)
    }

    return
  }

  const { b } = params

  if (b) {
    const newBranch = b === true ? await getInputBranchName() : b

    if (!newBranch) {
      log.error('分支名无效！')
      return
    }

    if (branches.includes(newBranch)) {
      log.error('本地已存在同名分支！')
      return
    }

    const baseBranch = await getBaseBranch(currentBranch, branches)
    await runCommand(`git checkout -b ${newBranch} ${baseBranch}`)
    log.success(`${newBranch} 创建成功 🔧`)
  }
}

module.exports = {
  runCheckoutCommand,
}
