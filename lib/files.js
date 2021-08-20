"use strict";

// ----------------- Dependencies ----------------- //

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const FormData = require('form-data');
const slash = require('slash');
const PluginError = require('plugin-error');

// Note: If you change the plugin name here change it in all other files as well
const PLUGIN_NAME = 'viewport-uploader';

// ----------------- Exports ----------------- //

exports.loadConfig = loadConfig;
exports.loadConfigSync = loadConfigSync;
exports.createFormData = createFormData;
exports.resolveGlob = resolveGlob;

// loads a target environment from .vpconfig.json asynchronously
async function loadConfig(envName, vpconfigName, vpconfigPath) {

    // check if .vpconfig.json exists
    if (!await fs.pathExists(vpconfigPath)) {
        throw new PluginError(PLUGIN_NAME, `Couldn't find a ${vpconfigName} file in your home directory. See https://github.com/K15t/viewport-uploader for further information on how to add a ${vpconfigName} file.`)
    }

    // get list of available target environments
    const vpconfig = await fs.readJson(vpconfigPath);
    if (!Object.keys(vpconfig).length) {
        throw new PluginError(PLUGIN_NAME,
            `No target environments found in ~/${vpconfigName}. See https://github.com/K15t/viewport-uploader for further information on how to add target environments to ~/${vpconfigName}.`)
    }

    // get selected target environment
    const targetEnv = vpconfig[envName];
    if (!targetEnv) {
        throw new PluginError(PLUGIN_NAME,
            `The target environment '${envName}' was not found in ~/${vpconfigName}. See https://github.com/K15t/viewport-uploader for further information on how to set target environments in ~/${vpconfigName}.`)
    }

    return targetEnv;
}

// Note: an async function can't be used in a constructor as of ES2020
// loads a target environment from .vpconfig.json synchronously
function loadConfigSync(envName, vpconfigName, vpconfigPath) {

    // check if .vpconfig.json exists
    if (!fs.existsSync(vpconfigPath)) {
        throw new PluginError(PLUGIN_NAME, `Couldn't find a ${vpconfigName} file in your home directory. Please see https://github.com/K15t/viewport-uploader for further information on how to add a ${vpconfigName} file.`)
    }

    // get list of available target environments
    const vpconfig = fs.readJsonSync(vpconfigPath);
    if (!Object.keys(vpconfig).length) {
        throw new PluginError(PLUGIN_NAME,
            `No target environments found in ~/${vpconfigName}. Please see https://github.com/K15t/viewport-uploader for further information on how to add target environments to ~/${vpconfigName}.`)
    }

    // get selected target environment
    const targetEnv = vpconfig[envName];
    if (!targetEnv) {
        throw new PluginError(PLUGIN_NAME,
            `The target environment '${envName}' was not found in ~/${vpconfigName}. Please see https://github.com/K15t/viewport-uploader for further information on how to set target environments in ~/${vpconfigName}.`)
    }

    return targetEnv;
}

// creates a form data object from file paths for Scroll Viewport
async function createFormData(sourcePaths, targetPaths) {
    const formData = new FormData();

    // correct file path to valid URL on Windows
    sourcePaths = sourcePaths.map(item => slash(item));
    targetPaths = targetPaths.map(item => slash(item));

    // builds form data stream with Scroll Viewport specific two seperate entries named "files" and "locations" for the content and path
    sourcePaths.forEach((_, i) => {
        formData.append('files', fs.createReadStream(sourcePaths[i]));
        formData.append('locations', targetPaths[i]);
    });

    return formData;
}

// resolves glob to array of filenames, taken relative to CWD
async function resolveGlob(glob) {
    return globby(glob);
}