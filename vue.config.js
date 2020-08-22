let BASE_URL = '/'
switch (process.env.DEPLOY) {
   case 'online':
      BASE_URL = 'https://cdn.jsdelivr.net/gh/reycn/notion-table@gh-pages/'
      break
   default:
      BASE_URL = '/'
}
module.exports = {
   publicPath: BASE_URL,
   configureWebpack: {
      // plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
      // CDN 加载组件
      externals: {
         'vue-router': 'VueRouter',
         'Vuex': 'Vuex',
      },
   },
   outputDir: 'dist',
   // publicPath: process.env.NODE_ENV === 'production' ? '/notion-table/' : '/'
}