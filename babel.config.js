module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV)

  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          useBuiltIns: 'usage',
          corejs: 3
        }
      ],
      '@babel/react'
    ],

    plugins: [
      ['lodash'],
      ['@babel/proposal-decorators', { legacy: true }],
      ['@babel/proposal-class-properties'],
      process.env.NODE_ENV === 'development' && 'react-refresh/babel',
      process.env.NODE_ENV === 'development' && 'react-dev-inspector/plugins/babel'
    ].filter(Boolean)
  }
}
