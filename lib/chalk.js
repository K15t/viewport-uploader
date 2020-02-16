"use strict";

// ----------------- Dependencies ----------------- //

const chalk = require('chalk');
const PluginError = require('plugin-error');

// ----------------- Configuration ----------------- //

const PLUGIN_NAME = 'gulp-viewport';

// ----------------- Exports ----------------- //

exports.showThemeCreated = showThemeCreated;
exports.showError = showError;
exports.showPluginError = showPluginError;
exports.showFetchError = showFetchError;

function showThemeCreated({envName, themeName, themeId}) {
    console.log(chalk.green(`The target environment '${envName}' will be used for the theme '${themeName || themeId}'.`));
}

function showError(error) {
    console.log(chalk.red('😢 Ups, something went wrong.'));
    throw new Error(error);
}

function showPluginError(error) {
    console.log(chalk.red('😢 Ups, something went wrong.'));
    throw new PluginError(PLUGIN_NAME, error);
}

// ToDo: only make one error function -> PluginError.
function showFetchError(error) {
    console.log(chalk.red('😢 Ups, something went wrong.'));
    throw new Error(error);
}