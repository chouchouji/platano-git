简体中文 | [English](README.md)

# platano-git

> 一个用于简化 **git** 操作的工具

## 使用指南

### 安装

#### 使用 npm

```shell
npm install platano-git -g
```

#### 使用 yarn

```shell
yarn global add platano-git
```

#### 适用 pnpm

```shell
pnpm add -g platano-git
```

_\* 通过运行 `platano -v` 查看是否安装成功_

### 示例

```shell
# 查看本地分支
platano br

# 推送代码
platano ps

# 拉取代码
platano pl

# 切换到main分支
platano ck main
```

### 命令

#### br

| 参数| 描述 | 等价命令|
| --- | --- | --- |
| ` ` | 查看所有本地分支 | `git branch` |
| `-a` | 查看所有分支 | `git branch -a` |
| `-m` | 重命名本地分支 | `git branch -m xxx yyy` |
| `-d` | 删除本地分支 | `git branch -D xxx` |
| `-r` | 删除远程分支 | `git push origin --delete xxx` |
| `-dr` | 删除本地和关联的远程分支 | `git branch -D xxx & git push origin --delete xxx` |

#### ck

| 参数| 描述 | 等价命令| 备注 |
| --- | --- | --- | --- |
| `[branch]` | 切换分支 | `git checkout xxx` | 如果输入分支，如`platano ck main`，将切换到 `main` 分支。 如果不输入任何内容（`platano ck`），将得到一个单选列表，可以在其中选择想要切换到的分支，选择一个分支后将切换到该分支。 |
| `-b [branch]` | 创建新分支 | `git checkout -b xxx yyy` | 如果输入分支，例如 `platano ck -b feat-xxx`，然后从分支列表中选择基准分支，它将基于选择的基准分支创建一个新分支 `feat-xxx`。 如果不输入任何内容（`platano ck -b`），它会提示需要输入新分支名称，然后选择基准分支，基于选择的基准分支创建一个新分支。 |


#### pl

| 参数| 描述 | 等价命令 |
| --- | --- | --- |
| ` ` | 拉取最新远程代码 | `git pull` |
| `-s` | 选择远程名称并拉取远程分支| `git pull xxx yyy` |

#### ps

| 参数| 描述 | 等价命令|
| --- | --- | --- |
| ` ` | 推送代码| `git push` |
| `-o` | 将代码推送到远程分支 | `git push origin xxx` |
| `-f` | 强制推送代码 | `git push -f` |
| `-u` | 推送并关联远程分支 | `git push --set-upstream origin xxx` |

## 反馈

如果遇到了问题或有好的想法和建议，请在此 [报告](https://github.com/chouchouji/platano-git/issues) 。

## 许可证

[MIT](LICENCE)
