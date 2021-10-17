const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const SentryWepackPlugin = require('@sentry/webpack-plugin')

const baseConfig = require('./webpack.config.base')
const config = require('./config')
const { resolve, assetsPath } = require('./utils')
const commonOptions = {
  chunks: 'all',
  reuseExistingChunk: true
}

module.exports = merge(baseConfig, {
  mode: 'production',

  devtool: 'source-map',

  output: {
    filename: assetsPath('js/[name].[chunkhash:6].min.js'),
    chunkFilename: assetsPath('js/[id].[chunkhash:6].min.js'),
    path: resolve(config.outputDir)
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    }),

    new MiniCssExtractPlugin({
      filename: assetsPath('css/[name].[contenthash:6].css'),
      chunkFilename: assetsPath('css/[id].[contenthash:6].css')
    }),

    // new SentryWepackPlugin({
    //   include: [resolve(config.outputDir)],
    //   urlPrefix: '~/dev/test/',
    //   ignoreFile: '.sentrycliignore',
    //   configFile: 'sentry.properties',
    //   release: 'v1.1.6'
    // }),

    new HtmlWebpackTagsPlugin({
      tags: [],
      usePublicPath: false,
      scripts: [
        {
          path:
            'https://cdn.bootcdn.net/ajax/libs/react/18.0.0-alpha-6f3fcbd6f-20210730/umd/react.production.min.js',
          external: {
            packageName: 'react',
            variableName: 'React'
          },
          attributes: {
            type: 'text/javascript'
          }
        },
        {
          path:
            'https://cdn.bootcdn.net/ajax/libs/react-dom/18.0.0-alpha-6f3fcbd6f-20210730/umd/react-dom.production.min.js',
          external: {
            packageName: 'react-dom',
            variableName: 'ReactDOM'
          },
          attributes: {
            type: 'text/javascript'
          }
        }
      ]
    }),

    config.report && new BundleAnalyzerPlugin()
  ].filter(Boolean),

  optimization: {
    runtimeChunk: {
      name: 'manifest'
    },

    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({ parallel: true }),

      new TerserPlugin({
        parallel: 4
      })
    ],

    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,

        polyfill: {
          test: /[\\/]node_modules[\\/](core-js|raf|@babel|babel)[\\/]/,
          name: 'polyfill',
          priority: 30,
          ...commonOptions
        },

        styles: {
          name: 'styles',
          test: /(reset|common|base|widget)\.(s?css|sass|styl|less)/,
          minSize: 1,
          ...commonOptions
        }
      }
    }
  }
})
