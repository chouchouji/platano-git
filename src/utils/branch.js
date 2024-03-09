const { runCommand } = require('./run')

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

function getCurrentBranch(branch) {
  const currentBranch = branch.split('\n').find((br) => br.includes('*'))

  return currentBranch.replace(/\*/g, '').trim()
}

function getRemoteNames(branch) {
  const remoteBranches = branch
    .split('\n')
    .filter((br) => br.includes('remotes/'))
    .map((br) => br.trim().replace(/remotes\//g, ''))
  const remoteNames = ['origin']

  remoteBranches.forEach((remoteBranch) => {
    const [remoteName, _rest] = remoteBranch.split('/')
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
