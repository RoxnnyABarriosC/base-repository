const CopyWebpackPlugin = require('copy-webpack-plugin');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = function(options, webpack)
{
    return {
        ...options,
        entry: ['webpack/hot/poll?100', options.entry],
        externals: [
            nodeExternals({
                allowlist: ['webpack/hot/poll?100']
            })
        ],
        plugins: [
            ...options.plugins,
            new webpack.HotModuleReplacementPlugin(),
            new webpack.WatchIgnorePlugin({
                paths: [/\.js$/, /\.d\.ts$/]
            }),
            new RunScriptWebpackPlugin({
                name: options.output.filename,
                autoRestart: false
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: '**/*.hbs',
                        to: '[path][name][ext]',
                        context: 'src'
                    }
                ]
            })
        ]
    };
};
