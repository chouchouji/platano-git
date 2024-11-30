import { formatChoices } from '@/utils/util.js'
import { select } from '@inquirer/prompts'

/**
 * 获取远程名
 * @param {string[]} choices 远端名称
 * @returns {string}
 */
export async function getSelectedRemoteName(choices) {
  const selectedName = await select({
    message: 'Please select remote name',
    choices: formatChoices(choices),
  })

  return selectedName
}
