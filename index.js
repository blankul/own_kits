#!/usr/bin/env node
// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { program } = require('commander')
const fs = require('fs')
const { gCfgByTpl } = require('./tpls')

program.version(JSON.parse(fs.readFileSync('./package.json') + '').version)

program.description('构建规范代码')

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program
  .command('install', {
    hidden: false,
  })
  .alias('i')
  .description('安装所需的第三方包')
  .action(() => {
    require('./actions/install_pkg')
  })

program
  .command('cfg', {
    hidden: false,
  })
  .description('生成 eslintrc prettierrc')
  .action(() => {
    gCfgByTpl('eslintrc')
    gCfgByTpl('prettierrc')
  })

program.parse(process.argv)
