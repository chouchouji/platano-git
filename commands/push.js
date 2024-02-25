const { runCommand } = require("../utils/run");
const { getCurrentBranch } = require("../utils/branch");
const log = require("../utils/log");
const { isEmptyObject } = require("../utils/util");

async function runPushCommand(params) {
  const branch = await runCommand("git branch");
  const currentBranch = getCurrentBranch(branch);

  if (isEmptyObject(params)) {
    await runCommand(`git push`);
    return;
  }

  const { u } = params;
  if (u) {
    await runCommand(`git push --set-upstream origin ${currentBranch}`);
    log.success('推送成功 🚀')
  }
}

module.exports = {
  runPushCommand,
};
