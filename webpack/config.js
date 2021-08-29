const assetsSubDirectory = process.env.npm_config_asd || 'assets' // npm run build --asd
const outputDir = process.env.npm_config_od || 'rainbow' // npm run build --od
const publicPath = process.env.PUBLIC_PATH || `/${outputDir}/`

module.exports = {
  assetsSubDirectory,
  publicPath,
  outputDir,
  report: process.env.npm_config_report // npm run build --report
}
