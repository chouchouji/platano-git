import { select } from '@inquirer/prompts'
import { formatChoices } from './util'

/**
 * 获取远程名
 * @param {string[]} choices 远端名称
 * @returns {string}
 */
export async function getSelectedRemoteName(choices: string[]) {
  const selectedName = await select({
    message: 'Please select remote name',
    choices: formatChoices(choices),
  })

  return selectedName
}
