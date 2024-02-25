const { runCommand } = require("../utils/run");
const { formatBranch } = require("../utils/branch");
const inquirer = require("inquirer");
const log = require("../utils/log");

const PROTECTED_BRANCHES = ["main", "dev"];

async function fetchAllBranches() {
  const branch = await runCommand("git branch -a");
  log.success(branch.trimEnd());
}

async function deleteLocalBranches() {
  const selectBranches = await getSelectBranches();

  const promises = selectBranches.map((branch) => {
    runCommand(`git branch -D ${branch}`);
  });

  await Promise.allSettled(promises);
}

async function deleteLocalAndRemoteBranches() {
  const selectBranches = await getSelectBranches();

  const localPromises = selectBranches.map((branch) =>
    runCommand(`git branch -D ${branch}`)
  );
  const remotePromises = selectBranches.map((branch) =>
    runCommand(`git push origin --delete ${branch}`)
  );

  await Promise.allSettled([...localPromises, ...remotePromises]);
}

async function getSelectBranches() {
  const res = await runCommand("git branch");
  const choices = formatBranch(res).filter(
    (branch) => !PROTECTED_BRANCHES.includes(branch)
  );

  const { selectBranches } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "branches",
      message: "请选择你要在本地删除的分支",
      choices,
    },
  ]);

  console.log(selectBranches);
}

async function runBranchCommand(params) {
  const { a, d } = params ?? {};
  if (a) {
    await fetchAllBranches();
  } else if (d) {
    await getSelectBranches();
  } else if (dr) {
    await deleteLocalAndRemoteBranches();
  }
}

module.exports = {
  runBranchCommand,
  fetchAllBranches,
};
