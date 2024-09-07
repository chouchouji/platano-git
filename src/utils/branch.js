const { runCommand } = require('./run')
const { ORIGIN } = require('../constants/remote')

/**
 * 获取本地分支列表
 * @param {string} branch 本地分支
 * @returns {string[]}
 */
function formatBranch(branch) {
  if (!branch) {
    return []
  }

  return branch
    .split('\n')
    .filter((br) => !br.includes('->'))
    .map((br) => {
      if (br.includes('*')) {
        return br.replace(/\*/g, '').trim()
      }

      return br.trim()
    })
    .filter(Boolean)
}

/**
 * 获取当前分支名称
 * @param {string} branch 本地分支
 * @returns {string}
 */
function getCurrentBranch(branch) {
  const currentBranch = branch.split('\n').find((br) => br.includes('*'))

  return currentBranch.replace(/\*/g, '').trim()
}

/**
 * 格式化远端名称为数组形式，远端名称如：origin、upstream
 * @param {string} remoteNames 远端名称
 * @returns {string[]}
 */
function formatRemoteNames(remoteNames) {
  return remoteNames
    .split('\n')
    .filter(Boolean)
    .map((br) => br.trim())
}

/**
 * 更新分支
 */
async function updateBranch() {
  await runCommand('git fetch -p')
}

/**
 * 获取远端名为origin的分支名称
 * @returns {string[]}
 */
async function getRemoteBranches() {
  await updateBranch()
  const allBranch = await runCommand('git branch -a')

  const allBranches = formatBranch(allBranch)
    .filter((branch) => branch.includes(ORIGIN))
    .map((branch) => branch.match(/origin\/(\S*)/)[1])

  return allBranches
}

module.exports = {
  formatBranch,
  getCurrentBranch,
  formatRemoteNames,
  getRemoteBranches,
  updateBranch,
}
