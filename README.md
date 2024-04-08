English | [简体中文](README.zh-CN.md)

# platano-git

> A tool for simplifying **git** operations

## User Guidance

### Install

#### Using [npm](https://www.npmjs.com/):

```shell
npm install platano-git -g
```

#### Using [yarn](https://yarnpkg.com/):

```shell
yarn global add platano-git
```

### Example

```shell
# View all local branches
platano br

# Push code to remote
platano ps

# Pull the latest remote code
platano pl
```

### Command

#### br

| Param | Description | Equal command |
| --- | --- | --- |
| ` ` | View all local branches | `git branch` |
| `-a` | View all branches | `git branch -a` |
| `-m` | Rename local branch | `git branch -m xxx yyy` |
| `-d` | Delete local branches | `git branch -D xxx` |
| `-r` | Delete remote branches | `git push origin --delete xxx` |
| `-dr` | Delete local and associated remote branches | `git branch -D xxx & git push origin --delete xxx` |

#### ck

| Param | Description | Equal command | Remark |
| --- | --- | --- | --- |
| `[branch]` | Switch branch | `git checkout xxx` | If you input the branch, like `platano ck main`, it will switch to `main`. If you don't input anything (`platano ck`), you will get a radio list which you can select the branch, click one then you will switch to that branch. |
| `-b [branch]` | Create new branch | `git checkout -b xxx yyy` | If you input the branch, like `platano ck -b feat-xxx`, then you select the base branch from rest branch list, it will create a new branch `feat-xxx`. If you don't input anything (`platano ck -b`), it prompts you need input the new branch, select you base branch then you will create a new branch. |




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