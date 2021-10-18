const fs = require('fs')
const os = require('os')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')

const { resolve, getEntries, getHtmlPlugins, assetsPath } = require('./utils')
const { assetsSubDirectory, publicPath } = require('./config')

const ENV = process.env.NODE_ENV
const isDev = ENV === 'development'

const globalCssHandlers = [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  },
  'postcss-loader'
]

const localCssHandlers = globalCssHandlers.map((handler, i) =>
  i == 1
    ? {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          modules: {
            mode: 'local',
            localIdentName: isDev
              ? '[path][name]__[local]'
              : '[name]--[hash:base64:5]'
          }
        }
      }
    : handler
)

module.exports = {
  entry: getEntries(),

  output: {
    filename: '[name].js',
    publicPath
    /*
    // Tell webpack what kind of ES-features may be used in the generated runtime-code.
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: true,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: true,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: true,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: false,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: true,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: false,
    },
    */
  },

  resolve: {
    extensions: ['.js', '.jsx'],

    alias: {
      '@': resolve('src')
    },

    modules: [resolve('node_modules'), resolve('src')]
  },

  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [
        __filename,
        resolve('babel.config.js'),
        resolve('postcss.config.js'),
        resolve('.browserslistrc')
      ]
    },
    name: `${ENV}-cache`
  },

  target: isDev ? 'web' : ['web', 'es5'],
  /*
  https://webpack.docschina.org/guides/asset-modules/
  资源模块(asset module)是一种模块类型，它允许使用资源文件（字体，图标等）而无需配置额外 loader。

  在 webpack 5 之前，通常使用：

  raw-loader 将文件导入为字符串
  url-loader 将文件作为 data URI 内联到 bundle 中
  file-loader 将文件发送到输出目录
  资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

  asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
  asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
  asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
  asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
  当在 webpack 5 中使用旧的 assets loader（如 file-loader/url-loader/raw-loader 等）和 asset 模块时，你可能想停止当前 asset 模块的处理，并再次启动处理，这可能会导致 asset 重复，你可以通过将 asset 模块的类型设置为 'javascript/auto' 来解决。
*/
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length + 4,
              workerParallelJobs: 50,
              workerNodeArgs: ['--max-old-space-size=1024']
            }
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },

      {
        test: /[^modules?]\.css$/,
        use: [...globalCssHandlers]
      },

      {
        test: /\.modules?.css$/,
        use: [...localCssHandlers]
      },

      {
        test: /[^modules?]\.less$/,
        use: [
          ...globalCssHandlers,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },

      {
        test: /\.modules?\.less$/,
        exclude: [/node_modules/],
        use: [
          ...localCssHandlers,
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf|htc)$/,
        type: 'asset/resource',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: assetsPath('fonts/[name].[hash:8][ext][query]')
        }
      },

      {
        test: /\.gif|jpe?g|png|svg$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: assetsPath('images/[name].[hash:8][ext][query]')
        }
      }
    ]
  },

  plugins: [
    ...getHtmlPlugins(),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('public'),
          to: assetsSubDirectory,
          force: true
        }
      ]
    }),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify(ENV),
      ASSETS_ROOT_PREFIX: JSON.stringify(`${publicPath}${assetsSubDirectory}`)
    }),

    new webpack.ProgressPlugin(),

    new LodashWebpackPlugin()
  ]
}
