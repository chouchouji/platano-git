#!/usr/bin/env node

const { Command } = require('commander')
const packageJson = require('../package.json')
const { runBranchCommand } = require('./commands/branch')
const { runPushCommand } = require('./commands/push')
const { runPullCommand } = require('./commands/pull')
const { runCheckoutCommand } = require('./commands/checkout')

const program = new Command()
program.name('platano-git').description('一个用于简化git操作的工具').version(packageJson.version, '-v', '查看版本')

program
  .command('br')
  .description('查看或删除分支')
  .option('-d', '删除本地分支')
  .option('-r', '删除远程分支')
  .option('-dr', '删除本地和对应的远端分支')
  .option('-a', '查看所有分支')
  .option('-m', '修改分支名')
  .action(async (options) => {
    await runBranchCommand(options)
  })

program
  .command('ps')
  .description('推送分支')
  .option('-u', '推送并关联远程分支')
  .option('-f', '强制推送到远程分支')
  .option('-o', '推送到远程分支')
  .action(async (options) => {
    await runPushCommand(options)
  })

program
  .command('pl')
  .description('拉取分支')
  .option('-s', '选择远端并拉取远端分支')
  .action(async (options) => {
    await runPullCommand(options)
  })

program
  .command('ck')
  .description('切换或创建分支')
  .argument('[branch]', '要切换到的分支')
  .option('-b [branch]', '创建新分支')
  .action(async (branch, options) => {
    await runCheckoutCommand(branch, options)
  })

program.parse()
