const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { resolve } = require('./utils')

module.exports = ['development', 'production'].map(mode => ({
  mode,

  devtool: mode === 'development' ? false : 'source-map',

  entry: {
    react: [
      'react',
      'react-dom',
      mode === 'development' && 'react-refresh/runtime'
    ].filter(Boolean),

    plugins: ['axios']
  },

  output: {
    filename: '[name].dll.[fullhash:8].js',
    path: resolve(`dll/${mode}`),
    library: '_dll_[name]'
  },

  target: ['web', 'es5'],

  plugins: [
    new CleanWebpackPlugin({
      verbose: true
    }),

    new webpack.DllPlugin({
      context: __dirname,
      name: '_dll_[name]',
      path: resolve(`dll/${mode}/[name].manifest.json`)
    })
  ]
}))
