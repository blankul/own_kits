/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')
const path = require('path')

/**
 *
 * @param {string} pkg
 */
function parsePkg(pkg) {
  const wildcard = pkg.match(/{.+}/)?.[0]
  if (wildcard) {
    return wildcard.match(/([^{},]+)/g).map((item) => pkg.replace(wildcard, item))
  }

  return [pkg]
}

/**
 *
 * @param {string[]} pkgs
 */
function parsePkgs(pkgs, shouldRmVersion = true) {
  return pkgs.reduce((result, pkg) => {
    return result.concat(shouldRmVersion ? rmVersion(parsePkg(pkg)) : parsePkg(pkg))
  }, [])
}

/**
 *
 * @param {string[]} pkgs
 */
function rmVersion(pkgs) {
  return pkgs.map((pkg) => pkg.replace(/(?<=[^^])@.+$/, ''))
}

/**
 *
 * @param {string[]} pkgs
 */
function filterByPkgJson(pkgs) {
  const { dependencies, devDependencies } = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'package.json')) + ''
  )
  const intalledPkgs = { ...dependencies, ...devDependencies }
  return pkgs.filter((pkg) => !!intalledPkgs[pkg])
}

module.exports = {
  parsePkg,
  parsePkgs,
  filterByPkgJson,
}
