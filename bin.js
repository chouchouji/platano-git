#!/usr/bin/env node
const { Command } = require("commander");
const { runBranchCommand } = require("./commands/branch");
const { runPushCommand } = require("./commands/push");

const program = new Command();
program.version("1.0.0");

program
  .command("branch")
  .option("-d", "删除本地分支")
  .option("-dr", "删除本地和对应的远端分支")
  .option("-a", "查看所有分支")
  .description("查看或删除分支")
  .action(async (params) => {
    await runBranchCommand(params);
  });

program
  .command("push")
  .option("-u", "推送并关联远程分支")
  .description("推送分支")
  .action(async (params) => {
    await runPushCommand(params);
  });

program.parse();
