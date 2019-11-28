//const path = require('path')
module.exports = {
  configureWebpack: {
    devtool: 'souce-map'
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/registration/' : '/',
  "transpileDependencies": [
    "vuetify"
  ]
}