import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const __dirname = path.resolve();

export default async (
  env: Record<string, string>,
  argv: { configName: string[]; mode: string },
) => {
  const plugins: webpack.WebpackPluginInstance[] = [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      scriptLoading: "blocking",
    }),
  ];

  const common: webpack.Configuration = {
    entry: {
      main: {
        import: "./src/main",
      },
    },
    resolve: {
      extensions: [".ts"],
    },
    output: {
      path: `${__dirname}/dist/`,
      filename: "[name].[contenthash].js",
      clean: true,
      publicPath: "/",
    },
    plugins,    
  }

  const configSwc: webpack.Configuration = {
    name: "swc-loader-swc-minification",
    ...common,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                },
              },
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
        }),
      ],
    },
  };

  const configTsSwc: webpack.Configuration = {
    name: "ts-loader-swc-minification",
    ...common,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    plugins,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
        }),
      ],
    },
  };

  const configTsTerser: webpack.Configuration = {
    name: "ts-loader-terser-minification",
    ...common,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({}),
      ],
    },
  };

  const configSwcTerser: webpack.Configuration = {
    name: "swc-loader-terser-minification",
    ...common,
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({}),
      ],
    },
  };

  return [
    configSwc,
    configTsSwc,
    configTsTerser,
    configSwcTerser,
  ];
};
