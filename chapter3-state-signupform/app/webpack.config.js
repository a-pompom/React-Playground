const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');

const isVanilla = false;
const entryPath = isVanilla ? './srcVanilla/index.ts' : './src/index.tsx';

module.exports = {
    /* ビルドオプション */
    mode: 'development',

    /* 入力 */
    entry: entryPath,
    /* 出力 */
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.js'
    },

    /* 開発サーバ */
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: 'localhost',
        port: 30000
    },

    /* webpackがバンドルするモジュールをどう扱うか */
    module: {
        /* loaderをモジュールへ適用するための規則 */
        rules: [
            {
                /* .ts or .tsxを対象 */
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    /* モジュールを読み込むとき、どう解決するか */
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        /* 参考: https://github.com/TypeStrong/ts-loader#baseurl--paths-module-resolution */
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
    }
};

