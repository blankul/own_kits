/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const { exec } = require('child_process')
const chalk = require('chalk')
const ora = require('ora')
const { parsePkgs, filterByPkgJson } = require('./parse_pkg')
// const execa = require('execa')

const execPromise = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })

/**
 * @param {string[]} pkgs
 * @param {'npm' | 'yarn'} pm 包管理器
 */
async function installPkgs(pkgs, pm = 'yarn') {
  const rawPkgsWithVersion = parsePkgs(pkgs)
  const rawPkgs = parsePkgs(pkgs, false)
  const installedPkgs = filterByPkgJson(rawPkgs)

  const { i, rm } = pmCfg[pm]
  const rmCmdStr = `${rm} ${installedPkgs.join(' ')}`
  const addCmdStr = `${i} ${rawPkgsWithVersion.join(' ')}`

  if (installedPkgs.length > 0) {
    const rmSpinner = ora(
      `${chalk.redBright('发现已存在的包, 正在卸载:')} ${chalk.gray(rmCmdStr)}`
    ).start()
    try {
      await execPromise(`${rmCmdStr}`)
      rmSpinner.succeed()
    } catch (error) {
      rmSpinner.fail()
    }
  }
  // await new Promise(res => setTimeout(res, 2e3))

  const addSpinner = ora(`${chalk.cyan('正在安装:')} ${chalk.gray(addCmdStr)}`).start()
  await execPromise(`${addCmdStr}`)
  // await new Promise(res => setTimeout(res, 2e3))
  addSpinner.succeed()
}

const pmCfg = {
  yarn: {
    i: 'yarn add --dev --exact',
    rm: 'yarn remove',
  },
  npm: {
    i: 'npm i -D --exact',
    rm: 'npm uninstall',
  },
}

module.exports = { installPkgs }
