"use strict";

// ----------------- Dependencies ----------------- //

const chalk = require('chalk');
const PluginError = require('plugin-error');

// ----------------- Configuration ----------------- //

const PLUGIN_NAME = 'gulp-viewport';

// ----------------- Exports ----------------- //

exports.showError = showError;
exports.showLog = showLog;

// error function to be able to customize it if needed
function showError(error) {
    console.log(chalk.red('😢 Ups, something went wrong.'));
    throw new PluginError(PLUGIN_NAME, error);
}

// logging function to be able to customize it if needed
function showLog(message) {
    console.log(chalk.green(message));
}