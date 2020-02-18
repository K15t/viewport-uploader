"use strict";

// ----------------- Dependencies ----------------- //

const chalk = require('chalk');

// ----------------- Exports ----------------- //

exports.showLog = showLog;

// logging function to be able to customize it if needed
function showLog(message) {
    console.log(chalk.green(message));
}