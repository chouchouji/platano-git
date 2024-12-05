import { select } from '@inquirer/prompts'

/**
 * 获取远程名
 * @param {string[]} choices 远端名称
 * @returns {string}
 */
export async function getSelectedRemoteName(choices: string[]) {
  const selectedName = await select<string>({
    message: 'Please select remote name',
    choices,
  })

  return selectedName
}
