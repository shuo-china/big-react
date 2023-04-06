import alias from '@rollup/plugin-alias'
import generatePackageJSON from 'rollup-plugin-generate-package-json'

import { getBaseRollupPlugins, getPackageJSON, resolvePkgPath } from './utils'

const pkgName = 'react-dom'
const { module } = getPackageJSON(pkgName)
const pkgPath = resolvePkgPath(pkgName)
const pkgDistPath = resolvePkgPath(pkgName, true)

export default [
  // react-dom
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: 'react-dom',
        format: 'umd'
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: 'react-dom/client',
        format: 'umd'
      }
    ],
    plugins: [
      ...getBaseRollupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`
        }
      }),
      generatePackageJSON({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => ({
          name,
          description,
          version,
          main: 'index.js',
          peerDependencies: {
            react: version
          }
        })
      })
    ]
  }
]
