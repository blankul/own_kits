/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

// eslint-disable-next-line no-redeclare
const { prompt } = require('inquirer')
const { installPkgs } = require('../utils/install')

;(async () => {
  const { packageManager } = await prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: '请选择包管理器',
      choices: [
        {
          checked: true,
          name: 'yarn',
        },
        'npm',
      ],
    },
  ])

  // 安装 eslint & prettier
  await installPkgs(
    ['eslint', 'prettier', 'eslint-plugin-prettier', 'eslint-config-prettier'],
    packageManager
  )

  // 安装 ts
  await installPkgs(
    ['typescript@4.3.5', '@typescript-eslint/{parser,eslint-plugin}'],
    packageManager
  )

  // 安装 react 相关
  await installPkgs(['eslint-plugin-{react,react-hooks}'], packageManager)

  const { isNeedGCfg } = await prompt([
    {
      type: 'confirm',
      name: 'isNeedGCfg',
      message: '是否生成 eslintrc prettierrc 配置',
    },
  ])

  if (isNeedGCfg) {
    require('./generate_cfg')
  }
})()
