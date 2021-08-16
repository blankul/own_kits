/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')
const ora = require('ora')

const tplInfo = {
  eslintrc: '.eslintrc.json',
  prettierrc: '.prettierrc.json',
  editorconfig: '.editorconfig',
}

/**
 * @param {keyof typeof tplInfo} name
 */
function getTpl(name) {
  return fs.readFileSync(path.resolve(__dirname, `${name}.ejs`))
}

/**
 * @param {keyof typeof tplInfo} name
 */
function gCfgByTpl(name) {
  const snipper = ora(`生成 ${name}`).start()
  fs.writeFile(path.resolve(process.cwd(), tplInfo[name]), getTpl(name), (err) => {
    if (err) {
      snipper.fail()
    } else {
      snipper.succeed()
    }
  })
}

module.exports = {
  tplInfo,
  getTpl,
  gCfgByTpl,
}
