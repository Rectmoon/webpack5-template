const path = require('path')
const express = require('express')
const app = express()

const port = 3000

const { publicPath, outputDir } = require('./webpack/config')

app.use(
  `${publicPath.slice(0, -1)}`,
  express.static(path.join(__dirname, outputDir), {
    maxAge: 3660000000
    // maxAge: 0
  })
)

app.get(`${publicPath}:path`, (req, res) => {
  res.sendFile(__dirname + `/${outputDir}/${req.params.path}.html`, {
    maxAge: 0
  })
})

app.listen(3000, () => {
  console.log(`Application is listening at http://localhost:${port}`)
})
