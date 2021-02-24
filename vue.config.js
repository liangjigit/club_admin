// process.env.BASE_URL = "http://47.95.192.109"
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: []
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 配置compression-webpack-plugin压缩
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: /\.js$|\.html$|\.css/,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ],
    resolve: {
      alias: {}
    }
  },
  chainWebpack: config => {
    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        "window.Quill": "quill"
      }
    ]);
    config.plugin("html").tap(args => {
      args[0].title = "爱慕CLUB运营管理后台";
      return args;
    });
  },
  devServer: {
    port: 8080,
    open: true,
    host: "localhost",
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      "/": {
        target: "https://clubtest.aimer.com.cn",
        changeOrigin: true
      }
    }
  },
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  outputDir: "dist",
  assetsDir: "assets"
};
