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
      file: `${pkgDistPath}/index.js`
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
          module: 'index.js'
        })
      })
    ]
  },
  // jsx-runtime
  {
    input: `${pkgPath}/src/jsx.ts`,
    output: [
      {
        file: `${pkgDistPath}/jsx-runtime.js`
      },
      {
        file: `${pkgDistPath}/jsx-dev-runtime.js`
      }
    ],
    plugins: getBaseRollupPlugins()
  }
]
