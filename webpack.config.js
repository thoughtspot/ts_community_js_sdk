const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/rest-api-v2.0.ts", // Specifies the root file to start with.  Webpack will find all other files from this one.
  devServer: {
    static: [{ directory: path.join(__dirname) }],
  },
  output: {
    filename: "rest-api-v2.0.js", // name of the file to create.
    path: path.resolve(__dirname, "dist"), // should match the folder in tsconfig, but needs the absolute path.
    publicPath: "/dist",
    library: {
      type: "module",
    },
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/, // files that end in .ts
        use: "ts-loader", // use the ts-loader
        exclude: /node-modules/, // ignore the node-modules.
      },
    ],
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
