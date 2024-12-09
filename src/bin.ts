#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { Command } from 'commander'
import { runBranchCommand } from './commands/branch'
import { runCheckoutCommand } from './commands/checkout'
import { runMergeCommand } from './commands/merge'
import { runPullCommand } from './commands/pull'
import { runPushCommand } from './commands/push'
import { runSwitchCommand } from './commands/switch'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'))

const program = new Command()

const { name, version, description } = packageJson
program.name(name).description(description)

program.version(version, '-v, --version')

program
  .command('br')
  .description('View, create or delete a branch')
  .argument('[branch]', 'Branch to create')
  .option('-d', 'Delete local branch')
  .option('-r', 'Delete remote branch')
  .option('-dr', 'Delete local and corresponding remote branch')
  .option('-a', 'View all branches')
  .option('-s', 'Select remote name')
  .option('-m [branch]', 'Rename branch')
  .action(async (branch, options) => {
    await runBranchCommand(branch, options)
  })

program
  .command('ps')
  .description('Push branch')
  .option('-u', 'Push and set upstream')
  .option('-f', 'Force push to remote branch')
  .option('-s', 'Push to remote branch')
  .action(async (options) => {
    await runPushCommand(options)
  })

program
  .command('pl')
  .description('Pull branch')
  .option('-s', 'Select and pull remote branch')
  .action(async (options) => {
    await runPullCommand(options)
  })

program
  .command('ck')
  .description('Switch or create branch')
  .argument('[branch]', 'The branch to switch to')
  .option('-b [branch]', 'Create a new branch and switch to it')
  .option('-r', 'Fetch remote branch when creating a new branch')
  .action(async (branch, options) => {
    await runCheckoutCommand(branch, options)
  })

program
  .command('sw')
  .description('Switch or create branch')
  .argument('[branch]', 'The branch to switch to')
  .option('-c [branch]', 'Create a new branch and switch to it')
  .option('-r', 'Fetch remote branch when creating a new branch')
  .action(async (branch, options) => {
    await runSwitchCommand(branch, options)
  })

program
  .command('mr')
  .description('Merge branch')
  .argument('[branch]', 'Branch to merge')
  .action(async (branch) => {
    await runMergeCommand(branch)
  })

program.parse()
