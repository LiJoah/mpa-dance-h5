import PnpWebpackPlugin from 'pnp-webpack-plugin'
import ModuleScopePlugin from 'react-dev-utils/ModuleScopePlugin'
import { Resolve } from 'webpack'
import paths from './paths'

export default {
  extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css'],
  modules: paths.resolveModules,
  alias: {
    react: require.resolve('react'),
    'react-dom': require.resolve('react-dom'),
    'react-router': require.resolve('react-router'),
    'react-router-dom': require.resolve('react-router-dom')
    // 'react-i18next': require.resolve('react-i18next'),
    // i18next: require.resolve('i18next'),
  },
  plugins: [
    PnpWebpackPlugin,
    // ModuleScopePlugin限制自己编写的模块只能从src目录中引入
    new ModuleScopePlugin(paths.src, [paths.appPackageJson])
  ]
} as Resolve
