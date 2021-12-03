const path = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { launchEditorMiddleware } = require('react-dev-inspector/plugins/webpack')

const baseConfig = require('./webpack.config.base')
const { publicPath } = require('./config')

module.exports = merge(baseConfig, {
  mode: 'development',

  devtool: 'inline-source-map',

  output: {
    devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
  },

  devServer: {
    hot: true,
    open: false,
    port: 9000,
    // quiet: true,  // 终端是否关闭打包日志
    // clientLogLevel: 'none', // 浏览器控制台是否输出编译相关日志
    transportMode: 'ws',
    before(app) {
      app.use(launchEditorMiddleware)

      app.get('/api/profile', (req, res) => {
        res.json({
          name: 'zhangsan',
          age: 20
        })
      })
    },
    proxy: {
      /**
       * proxy setting
       * 详细配置：https://github.com/chimurai/http-proxy-middleware
       */
      '/test/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/test': '' },
        bypass(req) {
          req.headers.Cookies = 'x=1'
          req.headers.aaa = '666'
        }
      }
    },

    historyApiFallback: {
      /**
       * @example
       * /rainbow/web => /rainbow/web.html
       * /rainbow/admin => /rainbow/admin.html
       */
      rewrites: Object.keys(baseConfig.entry)
        .map(entry => {
          const route = `${publicPath}${entry}`
          return {
            from: new RegExp(`^${route}$`),
            to: `${route}.html`
          }
        })
        .concat([
          {
            from: /.*/,
            to: path.posix.join(publicPath, 'index.html')
          }
        ])
    }
  },

  optimization: {
    moduleIds: 'named',
    runtimeChunk: 'single'
  },

  plugins: [
    new ReactRefreshPlugin({
      overlay: {
        entry: require.resolve('react-dev-utils/webpackHotDevClient'),
        module: require.resolve('react-dev-utils/refreshOverlayInterop'),
        sockIntegration: false,
      },
    })
  ]
})
