module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    // 设置代理
    proxy: {
      '/api/': {
        // 代理地址
        target: 'http://iwuzhen.org:18070/', // 需要代理的地址
        changeOrigin: true, // 是否跨域
        secure: false
      }
    }
  }
}
