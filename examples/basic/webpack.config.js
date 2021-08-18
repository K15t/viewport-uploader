const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ViewportTheme = require('@k15t/viewport-uploader');

module.exports = async (env) => {

    let viewportTheme;

    console.log(`Environment: ${env.development ? 'Development' : 'Production'}`);

    if (env.development || env.upload) {
        // The target system needs to match with a section in .vpconfig.json
        // How to use the different environments within the .vpconfig.json file is
        // explained here: https://github.com/K15t/viewport-uploader/#target-environment
        const envName = process.env.VPRT_ENV || 'DEV';

        // !! Create Theme in Viewport !!
        // Before you can upload your theme there must be a Viewport theme
        // with the exact same name like this VPRT_THEMENAME
        const themeName = process.env.VPRT_THEMENAME || 'My-Viewport-Theme';

        viewportTheme = new ViewportTheme({
            themeName: themeName,
            envName: envName,
        });

        await viewportTheme.create();
    }

    return {
        entry: './src/assets/scripts/index.js',
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'build/')
        },
        mode: env.development ? 'development' : 'production',
        devtool: env.development ? 'inline-source-map' : undefined,
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    use: [
                        'babel-loader'
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'src/',
                        from: '*.vm',
                        to: '[path][name][ext]'
                    }
                ]
            }),
            {
                apply: (compiler) => {
                    if (env.development || env.upload) {
                        compiler.hooks.done.tapPromise('BuildDonePlugin', async (compilation) => {
                            try {
                                await viewportTheme.reset();

                                await viewportTheme.upload({
                                    glob: 'build/',
                                    targetPath: '',
                                    sourcePath: 'build/'
                                });

                                console.log('\nUpload successful!\n');
                            } catch (err) {
                                console.error(err);
                            }
                        });
                    }
                }
            }
        ]
    }
}