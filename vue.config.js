const CopyWebpackPlugin = require("copy-webpack-plugin");
// const path = require("path");

// function resolve(url) {
//   return path.resolve(__dirname, url);
// }

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/vue-threejs/" : "/",
  outputDir: "vue-threejs",
  assetsDir: "static",
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./static",
            to: "static",
          },
        ],
      }),
    ],
  },
};
