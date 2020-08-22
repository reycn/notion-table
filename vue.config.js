module.exports = {
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