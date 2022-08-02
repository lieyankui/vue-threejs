const CopyWebpackPlugin = require("copy-webpack-plugin");
// const path = require("path");

// function resolve(url) {
//   return path.resolve(__dirname, url);
// }

module.exports = {
  publicPath: "./",
  outputDir: "dist",
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
