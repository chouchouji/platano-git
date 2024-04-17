English | [简体中文](README.zh-CN.md)

# platano-git

> A tool for simplifying **git** operations

## User Guidance

### Install

#### Using npm

```shell
npm install platano-git -g
```

#### Using yarn

```shell
yarn global add platano-git
```

#### Using pnpm

```shell
pnpm add -g platano-git
```

_\* run `platano -v` to check whether to install package successfully_

### Example

```shell
# View all local branches
platano br

# Push code to remote
platano ps

# Pull the latest remote code
platano pl

# Switch to main
platano ck main
```

### Command

#### br

| Param | Description | Equal command | Remark |
| --- | --- | --- | --- |
| `[branch]` | View all local branches or create a new branch | `git branch` | If you don't input anything (`platano br`), the console will log the complete local branch info. Otherwise, you input a branch (`platano br xxx`), it will create a new branch named `xxx`. Please note, it will not switch to the branch you had created. |
| `-a` | View all branches | `git branch -a` |
| `-m` | Rename local branch | `git branch -m xxx yyy` |
| `-d` | Delete local branches | `git branch -D xxx` |
| `-r` | Delete remote branches | `git push origin --delete xxx` |
| `-dr` | Delete local and associated remote branches | `git branch -D xxx & git push origin --delete xxx` |

#### ck

| Param | Description | Equal command | Remark |
| --- | --- | --- | --- |
| `[branch]` | Switch branch | `git checkout xxx` | If you input the branch, like `platano ck main`, it will switch to `main`. If you don't input anything (`platano ck`), you will get a radio list which you can select the branch, click one then you will switch to that branch. |
| `-b [branch]` | Create new branch | `git checkout -b xxx yyy` | If you input the branch, like `platano ck -b feat-xxx`, then you select the base branch from rest branch list, it will create a new branch `feat-xxx`. If you don't input anything (`platano ck -b`), it inquirer.prompts you need input the new branch, select you base branch then you will create a new branch and switch to this branch. |




#### pl

| Param | Description | Equal command |  
| --- | --- | --- | 
| ` ` | Pull the latest remote code | `git pull` | 
| `-s` | Select the remote end and pull the remote branch | `git pull xxx yyy` | 

#### ps

| Param | Description | Equal command |  
| --- | --- | --- | 
| ` ` | Push code | `git push` | 
| `-o` | Push code to remote branch | `git push origin xxx` | 
| `-f` | Force push code | `git push -f` | 
| `-u` | Push and associate remote branch | `git push --set-upstream origin xxx` | 


## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/platano-git/issues) here.

## License

[MIT](LICENCE)