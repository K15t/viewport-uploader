"use strict";

// ----------------- Dependencies ----------------- //

const chalk = require('chalk');
const PluginError = require('plugin-error');

// ----------------- Configuration ----------------- //

const PLUGIN_NAME = 'gulp-viewport';

// ----------------- Exports ----------------- //

exports.showThemeCreated = showThemeCreated;
exports.showPluginError = showPluginError;

function showThemeCreated({envName, themeName}) {
    console.log(chalk.green(`The target environment '${envName}' will be used for the theme '${themeName}'.`));
}

function showPluginError(error) {
    console.log(chalk.red('😢 Ups, something went wrong.'));
    throw new PluginError(PLUGIN_NAME, error);
}