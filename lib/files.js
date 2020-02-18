"use strict";

// ----------------- Dependencies ----------------- //

const fs = require('fs-extra');
const { showError } = require('./chalk.js');

// ----------------- Exports ----------------- //

exports.loadConfig = loadConfig;

// load targetEnv from .vpconfig.json
function loadConfig(envName, vpconfigName, vpconfigPath, envTemplate) {

    // check if .vpconfig.json exists
    if (!fs.existsSync(vpconfigPath)) {
        showError(`Couldn't find a ${vpconfigName} file in your home directory. Please use \'viewport config\' to configure target environments.`)
    }

    // get list of available target environments
    const vpconfig = fs.readJsonSync(vpconfigPath);
    if (!Object.keys(vpconfig).length) {
        showError(
            `No target environments found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
    }

    // get selected target environment
    const targetEnv = vpconfig[envName];
    if (!targetEnv) {
        showError(
            `The target environment '${envName}' was not found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
    }

    return targetEnv;
}