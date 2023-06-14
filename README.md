用来从git仓库上下载文件到本地的工具库，可以全局安装使用，用来下载自己的脚手架代码。

## Installation
```
npm install @hoseaguo/template -g
```

## Example
```
template create projectName --repository ownerName/repoName

template create projectName -r ownerName/repoName#tagName

template create projectName -r ownerName/repoName#branchName
```

## Usage
```
template create <app-name> --repository <repository> [--force]
```

- ### repository


`--repository <repository>` or `-r <repository>`


所要下载仓库代码的仓库简短地址，必须有，具体可以参考：
[download-git-repo#repository](https://www.npmjs.com/package/download-git-repo#repository)


- ### force

`--force` or `-f`

是否覆盖源来的文件，可选，默认用户选择。
