#! /usr/bin/env node
const program = require('commander');
// const chalk = require('chalk');

/* 
  参考文章：
    https://blog.csdn.net/qq_43402051/article/details/128180243
    https://www.jianshu.com/p/432cb0a914ff
*/

// 定义命令和参数
// create命令
program
.command('create')
.argument('<app-name>', 'app name')
.description('create a new project')
.requiredOption('-r, --repository <repository>', 'download-git-repo download repository option, like: owner/repo | gitlab:owner/repo#branch')
// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
.option('-f, --force', 'overwrite target directory if it exist')
.action((name, options) => {
    // 打印执行结果
    console.log('create a new project: ', name)
    // 打印执行结果
    require("../lib/create")(name, options)
})

program.parse();
