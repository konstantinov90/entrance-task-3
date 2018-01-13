const path = require('path');
const process = require('process');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // плагин минимизации
console.log(process.env.NODE_ENV);

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './public/scripts'), // устанавливаем путь к сборке
    publicPath: '/public/scripts/', // устанавливаем публичный путь, по которому файл будет доступен
    filename: 'build.js', // устанавливаем имя файла сборки
  },
  module: {
    // добавляем модуль vue-loader для загрузки компонентов
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader',
          },
          // buble: {
          //   transforms: {
          //     arrow: false,
          //     templateString: false
          //   }
          // }
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PROD_MODE: JSON.stringify((process.env.NODE_ENV || '').trim()),
    }),
  ].concat(process.env.NODE_ENV ? new UglifyJSPlugin() : []),
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
    },
  },
};
