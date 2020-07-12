module.exports = {
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === 'production' ? `./` : '/',
  configureWebpack: {
    name: "Insurance Transaction Creator",
    resolve: {
      symlinks: false
    }
  }
}
