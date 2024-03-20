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

async function getRemoteBranches() {
  await updateBranch()
  const allBranch = await runCommand('git branch -a')

  const allBranches = formatBranch(allBranch)
    .filter((branch) => branch.includes('origin'))
    .map((branch) => branch.match(/origin\/(\S*)/)[1])

  return allBranches
}

module.exports = {
  formatBranch,
  getCurrentBranch,
  getRemoteNames,
  getRemoteBranches,
  updateBranch,
}
