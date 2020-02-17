"use strict";

// ----------------- Dependencies ----------------- //

const fs = require('fs-extra');
const { showPluginError: showPluginError } = require('./chalk.js');

// ----------------- Exports ----------------- //

exports.loadConfig = loadConfig;

// load targetEnv from .vpconfig.json
function loadConfig({envName, vpconfigName, vpconfigPath, envTemplate}) {

    // check if .vpconfig.json exists
    if (!fs.existsSync(vpconfigPath)) {
        showPluginError(`Couldn't find a ${vpconfigName} file in your home directory. Please use \'viewport config\' to configure target environments.`)
    }

    // get list of available target environments
    const vpconfig = fs.readJsonSync(vpconfigPath);
    if (!Object.keys(vpconfig).length) {
        showPluginError(
            `No target environments found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
    }

    // get selected target environment
    const targetEnv = vpconfig[envName];
    if (!targetEnv) {
        showPluginError(
            `The target environment '${envName}' was not found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
    }

    return targetEnv;
}