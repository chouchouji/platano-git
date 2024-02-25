#!/usr/bin/env node
const { Command } = require("commander");

const program = new Command();
program.version("1.0.0");

program
  .command("branch")
  .description("查看分支")
  .action((res) => {
    console.log(res, "res");
  });

program.parse()
