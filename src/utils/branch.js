import { x } from 'tinyexec'
import { ORIGIN } from '@/constants/remote.js'

/**
 * 获取本地分支列表
 * @param {string} branch 本地分支
 * @returns {string[]}
 */
export function formatBranch(branch) {
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
export function getCurrentBranch(branch) {
  const currentBranch = branch.split('\n').find((br) => br.includes('*'))

  return currentBranch.replace(/\*/g, '').trim()
}

/**
 * 格式化远端名称为数组形式，远端名称如：origin、upstream
 * @param {string} remoteNames 远端名称
 * @returns {string[]}
 */
export function formatRemoteNames(remoteNames) {
  return remoteNames
    .split('\n')
    .filter(Boolean)
    .map((br) => br.trim())
}

/**
 * 更新分支
 */
export async function updateBranch() {
  await x('git', ['fetch', '-p'])
}

/**
 * 获取指定远端的分支名称
 * @param {string} remoteName 远端名称
 * @returns {string[]}
 */
export async function getRemoteBranches(remoteName) {
  await updateBranch()
  const { stdout: allBranch } = await x('git', ['branch', '-a'])

  const allBranches = formatBranch(allBranch)
    .filter((branch) => branch.includes(ORIGIN))
    .map((branch) => branch.match(new RegExp(`${remoteName}/(\\S*)`))[1])

  return allBranches
}
