const webpack = require("webpack");
const path = require("path");
const { spawn } = require("child_process");
const colors = require("colors");
const Dotenv = require("dotenv");
const NodeExternals = require("webpack-node-externals");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const { NODE_ENV, OPTIMIZED_BUILD } = process.env;

const envConfigPath = `./config/.env.${NODE_ENV}`;
const envConfig = Dotenv.config({ path: envConfigPath }).parsed;
const localEnvironment = NODE_ENV === "local";
const isOptimized = OPTIMIZED_BUILD === "true" || NODE_ENV === "production";
const webpackWatch = localEnvironment && !isOptimized;
const webpackMode = isOptimized ? "production" : "development";
const webpackDevtool = isOptimized ? false : "cheap-eval-source-map";

console.log(`Webpack building in ${isOptimized ? "optimized" : "non-optimized"} mode`);

const config = {
  entry: {
    index: path.resolve(__dirname, "src/index.ts"),
    dieharderInputFile: path.resolve(__dirname, "src/dieharderInputFile.ts"),
    gliOutput: path.resolve(__dirname, "src/gliOutput.ts"),
  },
  mode: webpackMode,
  watch: webpackWatch,
  watchOptions: {
    ignored: /node_modules/,
  },
  target: "node",
  devtool: webpackDevtool,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    sourceMapFilename: "[name]js.map",
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  externals: [NodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(ts|js)$/,
        enforce: "pre",
        use: [
          {
            loader: "eslint-loader",
            options: {
              emitWarning: true,
              emitError: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // We need NODE_ENV in the env object and as a separate expression
      // Otherwise, webpack will not build properly.
      "process.env": JSON.stringify({ ...process.env, ...envConfig }),
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
    }),
  ],
  optimization: {
    // Don't let webpack override our NODE_ENV
    nodeEnv: false,
  },
};

if (isOptimized) {
  config.optimization = {
    ...config.optimization,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ["console.info", "console.debug", "console.warn"],
          },
          output: {
            beautify: false,
            comments: false,
          },
        },
      }),
    ],
  };
}

if (localEnvironment) {
  config.plugins.push(new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin(), {
    apply: (compiler) => {
      let executed = false;
      compiler.hooks.afterEmit.tap("AfterFirstEmitPlugin", () => {
        if (!executed) {
          const cmd = spawn("yarn", ["start:watch"], { stdio: "pipe" });
          cmd.stdout.on("data", function (data) {
            console.log(colors.blue.bold(data.toString()));
          });
          cmd.stderr.on("data", function (data) {
            console.error(colors.red.bold(data.toString()));
          });
          cmd.on("exit", function (code) {
            console.log("AfterFirstEmitPlugin exited with code " + code.toString());
          });
          executed = true;
        }
      });
    },
  });
}

module.exports = config;
