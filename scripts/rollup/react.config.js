import generatePackageJSON from 'rollup-plugin-generate-package-json'

import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'

const pkgName = 'react'
const { module } = getPackageJSON(pkgName)
const pkgPath = resolvePkgPath(pkgName)
const pkgDistPath = resolvePkgPath(pkgName, true)

export default [
  // react
  {
    input: `${pkgPath}/${module}`,
    output: {
      file: `${pkgDistPath}/index.js`,
      name: 'react',
      format: 'umd'
    },
    plugins: [
      ...getBaseRollupPlugins(),
      generatePackageJSON({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js'
        })
      })
    ]
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`,
        name: 'jsx-runtime',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`,
        name: 'jsx-dev-runtime',
        format: 'umd'
      }
    ],
    plugins: getBaseRollupPlugins()
  }
]
