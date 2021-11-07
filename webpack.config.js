const path = require('path');

module.exports = {
    // entry: ['./public/javascripts/components/registerForm.js', './public/javascripts/components/loginForm.js'],
    entry: {
        // react: './public/javascripts/components/react.js',
        // registerForm: './reactComponents/login/registerForm.js',
        // loginForm: './reactComponents/login/loginForm.js',
        // adminDash: './reactComponents/dashboard/admin.js',
        // userDash: './reactComponents/dashboard/user.js'
        // likeButton: './src/examples/like_button.js'
        algoAccountConnectForm: './src/home/algoAccountConnectForm.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', "@babel/preset-react"],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            }
        }]
    },
    mode: 'development',
    // watch: true
};