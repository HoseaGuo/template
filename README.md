## installation
```
npm install @hoseaguo/template -g
```

## Example
```bash
template create projectName --repository ownerName/repoName
```
## API
### 命令行
```
template create <app-name> --repository <repository> [--force]
```

- ### repository

```
--repository <repository>` or `-r <repository>
```

所要下载仓库代码的仓库简短地址，具体可以参考：
[download-git-repo#repository](https://www.npmjs.com/package/download-git-repo#repository)


- ### force

```
--force or -f
```

是否覆盖源来的文件。
