function formatBranch(branch) {
  if (!branch) {
    return []
  }

  const reg = new RegExp('\\*', 'g')
  return branch
    .split('\n')
    .map((br) => {
      if (br.includes('*')) {
        br = br.replace(reg, '')
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

module.exports = {
  formatBranch,
  getCurrentBranch,
}
