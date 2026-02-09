// export plugins
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FileIncludeWebpackPlugin = require('file-include-webpack-plugin-replace');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

// variables
const isProd = process.env.NODE_ENV === 'production';
const mode = isProd ? 'production' : 'development';
const target = isProd ? 'browserslist' : 'web';
const pages = [
  new FileIncludeWebpackPlugin({
    source: 'src',
    htmlBeautifyOptions: {
      'indent-with-tabs': true,
      indent_size: 3,
    },
    replace: isProd
      ? [
          { regex: '../img', to: 'img' },
          { regex: '@img', to: 'img' },
          { regex: '@js', to: '' },
          { regex: 'NEW_PROJECT_NAME', to: path.basename(path.resolve()) },
        ]
      : [
          { regex: '<link rel="stylesheet" href="css/style.css">', to: '' },
          { regex: '@img', to: '../img' },
          { regex: 'NEW_PROJECT_NAME', to: path.basename(path.resolve()) },
        ],
  }),
];

module.exports = {
  mode,
  target,

  // entry point
  entry: {
    app: path.resolve(__dirname, 'src/js/app.js'),
    dummy: path.resolve(__dirname, 'src/js/dummy.js'),
  },

  // where the bundled file will resolve
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: 'js/[name].js',
    clean: true,
  },

  // dev server
  devServer: {
    historyApiFallback: true,
    open: true,
    hot: true,
    port: 'auto',
    host: 'local-ip',
    static: path.resolve(__dirname, 'app'),
    watchFiles: path.join(__dirname, 'src'),
    client: {
      overlay: false,

      // overlay: {
      //  errors: true,
      //  warnings: false,
      //  runtimeErrors: true,
      //}
    },
  },

  // source map
  devtool: 'inline-source-map',

  // plugins
  plugins: [
    ...pages,
    new CopyPlugin({
      patterns: [
        // copy images
        {
          from: 'src/img',
          to: 'img',
          noErrorOnMissing: true,
        },
        // copy fonts
        {
          from: 'src/fonts',
          to: 'fonts',
          noErrorOnMissing: true,
        },
        // copy additional assets
        {
          from: 'src/files',
          to: 'files',
          noErrorOnMissing: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],

  // modules
  module: {
    rules: [
      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      // css
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                { search: '@img', replace: '../img', flags: 'g' },
                { search: '@fonts', replace: '../fonts', flags: 'g' },
              ],
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          'group-css-media-queries-loader',
          'sass-loader',
        ],
      },
    ],
  },

  // optimization
  optimization: {
    minimizer: [
      // js
      new TerserPlugin({
        extractComments: false,
      }),

      // images
      new ImageMinimizerPlugin({
        loader: true,
        generator: [
          {
            type: 'asset',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            filename: '[path][name][ext]',
            options: {
              plugins: [
                'imagemin-gifsicle',
                'imagemin-mozjpeg',
                'imagemin-pngquant',
                'imagemin-svgo',
              ],
            },
          },
        ],
      }),
      // new ImageminWebpWebpackPlugin({
      //   config: [
      //     {
      //       test: /\.(jpe?g|png)/,
      //       options: {
      //         quality: 75,
      //       },
      //     },
      //   ],
      //   overrideExtension: true,
      //   detailedLogs: false,
      //   silent: false,
      //   strict: true,
      // }),
    ],
  },

  // resolve
  resolve: {
    alias: {
      '@scss': `${path.resolve(__dirname, 'src')}/scss`,
      '@js': `${path.resolve(__dirname, 'src')}/js`,
      '@img': `${path.resolve(__dirname, 'src')}/img`,
    },
  },
};
