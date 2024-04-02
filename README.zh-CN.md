# platano-git

> 一个用于简化 **git** 操作的工具

## 使用指南

### 安装

#### 使用 [npm](https://www.npmjs.com/):

```shell
npm install platano-git -g
```

#### 使用 [yarn](https://yarnpkg.com/):

```shell
yarn global add platano-git
```

### 示例

```shell
# 查看本地分支
platano br

# 推送代码
platano ps

# 拉取代码
platano pl
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

| 参数| 描述 | 等价命令|
| --- | --- | --- |
| ` ` | 切换分支 | `git checkout xxx` |
| `-b` | 创建新分支 | `git checkout -b xxx yyy` |


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
