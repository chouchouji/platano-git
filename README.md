# platano-git

> A tool for simplifying **git** operations

## User Guidance

### Install

#### Using [npm](https://www.npmjs.com/):

```
npm install platano-git -g
```

#### Using [yarn](https://yarnpkg.com/):

```
yarn global add platano-git
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

| Param | Description | Equal command |  
| --- | --- | --- | 
| ` ` | Checkout branch | `git checkout xxx` | 
| `-b` | Create new branch | `git checkout -b xxx yyy` | 


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