English | [简体中文](README.zh-CN.md)

# platano-git

> A tool for simplifying **git** operations

## Notes

> [!TIP]
> If you use ***0.2+***, the lowest node version should be more than ***18+***.

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

_\* run `platano -v` ***0.2.0+*** or `platano --version` to check whether to install package successfully_

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

| Param | Description | Equal command | Remark | Example |
| --- | --- | --- | --- | --- |
| `[branch]` | View all local branches or create a new branch | `git branch` | If you don't input anything (`platano br`), the console will log the complete local branch info. Otherwise, you input a branch (`platano br xxx`), it will create a new branch named `xxx`. Please note, it will not switch to the branch you had created. |
| `-a` | View all branches | `git branch -a` |
| `-m [branch]` | Rename local branch | `git branch -m xxx yyy` | If you enter nothing (`platano br -m`), you will be prompted to select the base branch and enter a new branch name. If you enter a branch (`platano br -m xxx`), the current branch will be renamed to `xxx` | ![br-m](https://github.com/user-attachments/assets/70c1ffc1-1f71-4a92-bdea-0b8866a748ef) |
| `-d` | Delete local branches | `git branch -D xxx` | It will **forcefully** delete branch |
| `-s` | Select remote name when delete remote branches. The default value is `origin` | `-` |
| `-r` | Delete remote branches | `git push xxx --delete yyy` |
| `-dr` | Delete local and associated remote branches | `git branch -D yyy && git push xxx --delete yyy` | | ![br-dr](https://github.com/user-attachments/assets/43f40fe3-cec2-4803-ba2f-df5cb23f6749) |

#### ck

| Param | Description | Equal command | Remark |
| --- | --- | --- | --- |
| `[branch]` | Switch branch | `git checkout xxx` | If you input the branch, like `platano ck main`, it will switch to `main`. If you don't input anything (`platano ck`), you will get a radio list which you can select the branch, click one then you will switch to that branch. |
| `-b [branch]` | Create new branch and switch to this branch | `git checkout -b xxx yyy` | If you input the branch, like `platano ck -b feat-xxx`, then you select the base branch from rest branch list, it will create a new branch `feat-xxx`. If you don't input anything (`platano ck -b`), it prompts you need input the new branch, select you base branch then you will create a new branch and switch to this branch. |

#### sw

| Param | Description | Equal command | Remark | Example |
| --- | --- | --- | --- | --- | 
| `[branch]` | Switch branch | `git switch xxx` | If you input the branch, like `platano sw main`, it will switch to `main`. If you don't input anything (`platano sw`), you will get a radio list which you can select the branch, click one then you will switch to that branch. | ![sw](https://github.com/user-attachments/assets/b3d7bcfe-16fb-4c74-95be-302e7d7de744) |
| `-c [branch]` | Create new branch and switch to this branch | `git switch -c xxx yyy` | If you input the branch, like `platano sw -c feat-xxx`, then you select the base branch from rest branch list, it will create a new branch `feat-xxx`. If you don't input anything (`platano sw -c`), it prompts you need input the new branch, select you base branch then you will create a new branch and switch to this branch. | ![sw-c](https://github.com/user-attachments/assets/6f51274f-90e5-4cf8-8e40-cc826cc2f3f0) |

_\* The lowest supported git version is **2.23**_


#### pl

| Param | Description | Equal command | Remark | Example | 
| --- | --- | --- | --- | --- |
| ` ` | Pull the latest remote code | `git pull` | |
| `-s` | Select the remote end and pull the remote branch | `git pull xxx yyy` | | ![pl-s](https://github.com/user-attachments/assets/26abc485-b361-4f5d-a161-3aa951720c24) |

#### ps

| Param | Description | Equal command |  
| --- | --- | --- | 
| ` ` | Push code to origin, if current branch doesn't exists, it will create same remote branch  | `git push origin currentBranch` | 
| `-s` | Push code to remote branch, the default remote name is `origin` | `git push xxx yyy` | 
| `-f` | Force push code | `git push xxx yyy -f` | 
| `-u` | Push and associate remote branch | `git push --set-upstream xxx yyy` | 

#### mr

| Param | Description | Equal command | Remark |
| --- | --- | --- | --- |
| `[branch]` | Merge branch | `git merge xxx` | If you input the branch, like `platano mr feat-xxx`, it will merge `feat-xxx`. If you don't input anything (`platano mr`), you will get a radio list which you can select the branch, click one then you will merge that branch. |

## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/platano-git/issues) here.

## License

[MIT](LICENSE)
