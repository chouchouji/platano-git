const { runCommand } = require('../utils/run')
const { getCurrentBranch, formatBranch } = require('../utils/branch')
const log = require('../utils/log')
const { isEmptyObject } = require('../utils/util')
const inquirer = require('inquirer')

async function getSelectLocalBranch() {
  const branch = await runCommand('git branch')
  const currentBranch = await getCurrentBranch(branch)
  const choices = formatBranch(branch).filter((br) => br !== currentBranch)

  if (!choices.length) {
    log.warning('暂无可以切换的分支')
    return
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

async function runCheckoutCommand(params) {
  if (isEmptyObject(params)) {
    const branch = await getSelectLocalBranch()

    if (branch) {
      await runCommand(`git checkout ${branch}`)
      log.success(`成功切换到 ${branch} 🎉`)
    }
  }
}

module.exports = {
  runCheckoutCommand,
}
