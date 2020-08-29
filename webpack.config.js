const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "index_bundle.js",
    publicPath: "/"
  },
  devServer: {
    historyApiFallback: true,
    port: 9000,
    contentBase: './',
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]',
                outputPath: 'images',
            },
        },
    },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('./src/index.html'),
    })
  ],
  node: { fs: 'empty' }
};