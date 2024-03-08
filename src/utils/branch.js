const { runCommand } = require('./run')

function formatBranch(branch) {
  if (!branch) {
    return []
  }

  const reg = new RegExp('\\*', 'g')
  return branch
    .split('\n')
    .filter((br) => !br.includes('->'))
    .map((br) => {
      if (br.includes('*')) {
        return br.replace(reg, '').trim()
      }

      return br.trim()
    })
    .filter(Boolean)
}

function getCurrentBranch(branch) {
  const reg = new RegExp('\\*', 'g')
  const currentBranch = branch.split('\n').find((br) => br.includes('*'))

  return currentBranch.replace(reg, '').trim()
}

function getRemoteNames(branch) {
  const reg = new RegExp('remotes/', 'g')
  const remoteBranches = branch
    .split('\n')
    .filter((br) => br.includes('remotes/'))
    .map((br) => br.trim().replace(reg, ''))
  const remoteNames = ['origin']

  remoteBranches.forEach((branch) => {
    const [remoteName, _rest] = branch.split('/')
    if (remoteName && !remoteNames.includes(remoteName)) {
      remoteNames.push(remoteName)
    }
  })

  return remoteNames
}

async function updateBranch() {
  await runCommand('git fetch -p')
}

module.exports = {
  formatBranch,
  getCurrentBranch,
  getRemoteNames,
  updateBranch,
}
