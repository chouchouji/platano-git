const { runCommand } = require('../utils/run')
const log = require('../utils/log')
const { getRemoteNames } = require('../utils/branch')

async function getSelectRemoteName() {
  const res = await runCommand('git branch -a')
  const choices = getRemoteNames(res)

  const { selectName } = await inquirer.prompt([
    {
      type: 'radio',
      name: 'selectName',
      message: '请选择你要拉取的远程名字',
      choices,
    },
  ])

  return selectName
}

async function runPullCommand(params) {
  if (isEmptyObject(params)) {
    await runCommand('git pull')
    log.success('拉取成功 ⬇️')
    return
  }

  const { s } = params

  if (s) {
    const remoteName = await getSelectRemoteName()
    const currentBranch = await getCurrentBranch()

    await runCommand(`git pull ${remoteName} ${currentBranch}`)
    log.success(`拉取 ${remoteName}/${currentBranch} 成功 ⬇️`)
  }
}

module.exports = {
  runPullCommand,
}
