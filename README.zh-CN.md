简体中文 | [English](README.md)

# platano-git

> 一个用于简化 **git** 操作的工具

## 提示

> [!TIP]
> 如果你是用的版本是 ***0.2+***, node的最低版本应该 ***18+***.

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

_\* 通过运行 `platano -v` ***0.2.0+*** 或者 `platano --version` 查看是否安装成功_

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

| 参数| 描述 | 等价命令| 备注 | 示例 |
| --- | --- | --- | --- | --- |
| `[branch]` | 查看所有本地分支或创建新分支 | `git branch` | 如果不输入任何内容（`platano br`），控制台将输出完整的本地分支信息。 如果输入一个分支（`platano br xxx`），它将创建一个名为`xxx`的新分支。 请注意，此命令不会自动切换到新创建的分支。|
| `-a` | 查看所有分支 | `git branch -a` |
| `-m [branch]` | 重命名本地分支 | `git branch -m xxx yyy` | 如果不输入任何内容（`platano br -m`），会提示您选择基准分支，输入新分支名。 如果输入一个分支（`platano br -m xxx`），会将当前分支重命名为`xxx` | ![br-m](https://github.com/user-attachments/assets/70c1ffc1-1f71-4a92-bdea-0b8866a748ef) |
| `-s` | 删除远程分支时，选择指定的远端名称，默认是 `origin` | `-` |
| `-d` | 删除本地分支 | `git branch -D xxx` | 会**强制**删除分支 |
| `-r` | 删除远程分支 | `git push xxx --delete yyy` |
| `-dr` | 删除本地和关联的远程分支 | `git branch -D yyy && git push xxx --delete yyy` | | ![br-dr](https://github.com/user-attachments/assets/43f40fe3-cec2-4803-ba2f-df5cb23f6749) |

#### ck

| 参数| 描述 | 等价命令| 备注 |
| --- | --- | --- | --- |
| `[branch]` | 切换分支 | `git checkout xxx` | 如果输入分支，如`platano ck main`，将切换到 `main` 分支。 如果不输入任何内容（`platano ck`），将得到一个单选列表，可以在其中选择想要切换到的分支，选择一个分支后将切换到该分支。 |
| `-b [branch]` | 创建新分支并切换到此分支 | `git checkout -b xxx yyy` | 如果输入分支，例如 `platano ck -b feat-xxx`，然后从分支列表中选择基准分支，它将基于选择的基准分支创建一个新分支 `feat-xxx`。 如果不输入任何内容（`platano ck -b`），它会提示需要输入新分支名称，然后选择基准分支，基于选择的基准分支创建一个新分支并切换到此分支。 |

#### sw

| 参数| 描述 | 等价命令| 备注 | 示例 |
| --- | --- | --- | --- | --- |
| `[branch]` | 切换分支 | `git switch xxx` | 如果输入分支，如`platano sw main`，将切换到 `main` 分支。 如果不输入任何内容（`platano sw`），将得到一个单选列表，可以在其中选择想要切换到的分支，选择一个分支后将切换到该分支。 | ![sw](https://github.com/user-attachments/assets/b3d7bcfe-16fb-4c74-95be-302e7d7de744) |
| `-c [branch]` | 创建新分支并切换到此分支 | `git switch -c xxx yyy` | 如果输入分支，例如 `platano sw -c feat-xxx`，然后从分支列表中选择基准分支，它将基于选择的基准分支创建一个新分支 `feat-xxx`。 如果不输入任何内容（`platano sw -c`），它会提示需要输入新分支名称，然后选择基准分支，基于选择的基准分支创建一个新分支并切换到此分支。 | ![sw-c](https://github.com/user-attachments/assets/6f51274f-90e5-4cf8-8e40-cc826cc2f3f0) |

_\* 此命令的最低 git 版本为 **2.23**_

#### pl

| 参数| 描述 | 等价命令 | 备注 | 示例 |
| --- | --- | --- | --- | --- |
| ` ` | 拉取最新远程代码 | `git pull` |
| `-s` | 选择远程名称并拉取远程分支| `git pull xxx yyy` | | ![pl-s](https://github.com/user-attachments/assets/26abc485-b361-4f5d-a161-3aa951720c24) |

#### ps

| 参数| 描述 | 等价命令|
| --- | --- | --- |
| ` ` | 推送代码| `git push` |
| `-s` | 将代码推送到远程分支，默认是 `origin` | `git push xxx yyy` |
| `-f` | 强制推送代码 | `git push xxx yyy -f` |
| `-u` | 推送并关联远程分支 | `git push --set-upstream xxx yyy` |

#### mr

| 参数| 描述 | 等价命令| 备注 |
| --- | --- | --- | --- |
| `[branch]` | 合并分支 | `git merge xxx` | 如果输入分支，如`platano mr feat-xxx`，将合并`feat-xxx` 分支。 如果不输入任何内容（`platano mr`），将得到一个单选列表，可以在其中选择想要合并的分支，选择一个分支后将合并该分支。 |

## 反馈

如果遇到了问题或有好的想法和建议，请在此 [报告](https://github.com/chouchouji/platano-git/issues) 。

## 许可证

[MIT](LICENSE)
