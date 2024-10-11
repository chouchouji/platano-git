import { rawlist } from '@inquirer/prompts'
import { formatChoices } from './util.js'

/**
 * 获取要推送的远程名
 * @param {string[]} choices 远端名称
 * @returns {string}
 */
export async function getSelectedRemoteName(choices) {
  const selectedName = await rawlist({
    message: '请选择你要推送的远程名',
    choices: formatChoices(choices),
  })

  return selectedName
}
