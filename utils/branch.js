function formatBranch(branch) {
  if (!branch) {
    return [];
  }

  const reg = new RegExp("\\*", "g");
  return branch
    .split("\n")
    .map((br) => {
      if (br.includes("*")) {
        br = br.replace(reg, "");
      }

      return br.trim();
    })
    .filter(Boolean);
}

module.exports = {
  formatBranch,
};
