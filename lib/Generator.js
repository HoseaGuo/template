const ora = require('ora');
const inquirer = require('inquirer');
const util = require('util');
const downloadGitRepo = require('download-git-repo'); // 不支持 Promise
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');

axios.interceptors.response.use((res) => {
  return res.data;
});

/* 模板仓库github配置 */
// github的用户名
// let owner = '';
// 仓库名
// let repo = '';

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    console.log(error);
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...');
    process.exit(1);
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 根据命令的 repository 参数对象，获得owner和repo
    // this.options = options;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  // 根据远程获取到该仓库的tag的列表，并且进行选择
  async selectTag(owner, repo) {
    // 远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', owner, repo);

    if (!tags?.length) {
      return console.log(`As no tags in your repository, it will download from the default branch.`);
    }

    // 获得tagName数组
    const tagNameList = tags.map((item) => item.name);

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagNameList,
      message: 'Please choose a tag to create project',
    });

    return tag;
  }

  // 下载远程模板
  async downloadGitTemplate(repository) {
    // 仓库地址 文档：https://www.npmjs.com/package/download-git-repo#repository
    // const repository = `${owner}/${repo}${tag ? '#' + tag : ''}`;

    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      repository, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir) // 参数2: 创建位置
    );
  }

  async create(repository) {
    /* 根据repository做处理，如果没有#，则会进行tag获取-选择，否则，直接下载 */
    let match = repository.match(/([a-zA-Z]*?):?([\w-]*)\/([\w-]*)#?([\w-]*)?/);
    if (match) {
      let [, platform, owner, repo, tag] = match;
      // 如果是github且没有tag或者branch，则请求tag列表，进行选择

      if (platform === 'github' || !platform && !tag) {
        tag = await this.selectTag(owner, repo);
        repository = `${owner}/${repo}#${tag}`;
      }

      // 下载模板到模板目录
      await this.downloadGitTemplate(repository);

      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    } else {
      console.log(chalk.red(`--repository 参数字段不符合要求`));
    }
  }
}

/**
 * 获取仓库列表
 * @returns Promise
 */
// async function getRepoList() {
//   return axios.get(`https://api.github.com/users/${owner}/repos`);
// }

/**
 * 获取版本列表
 * 参考文档：https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repository-tags--code-samples
 */
async function getTagList(owner, repo) {
  console.log(owner, repo)
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`);
}

module.exports = Generator;
