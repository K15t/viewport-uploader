"use strict";

// ----------------- Dependencies ----------------- //

const fs = require('fs-extra');
const { regexVal, envTemplate } = require('./lib/validate.js');

// ----------------- Configuration ----------------- //

const vpconfigName = ".vpconfig.json";
const vpconfigPath = path.join(os.homedir(), vpconfigName); // absolute path

// NOTE: The template object for validation is in lib/validate.js

// ----------------- Class ----------------- //

class ViewportTheme {
  constructor({themeName, envName}) {
    const targetEnv = loadConfig(envName);
    const envTemplateKeys = Object.keys(envTemplate);
    envTemplateKeys.forEach(item => {this[item] = targetEnv[item]});
  }
}

exports.ViewportTheme = ViewportTheme;

// load targetEnv from .vpconfig.json
function loadConfig(envName) {

  // check if .vpconfig.json exists
  if (!fs.existsSync(vpconfigPath)) {
    throw new Error(`Couldn't find a ${vpconfigName} file in your home directory. Please use \'viewport config\' to configure target environments.`)
  }

  // get list of available target environments
  const vpconfig = fs.readJsonSync(vpconfigPath);
  if (!Object.keys(vpconfig).length) {
    throw new Error(
        `No target environments found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
  }

  // get selected target environment
  const targetEnv = vpconfig[envName];
  if (!targetEnv) {
    throw new Error(
        `The target environment '${envName}' was not found in ~/${vpconfigName}. Please use \'viewport config\' to configure target environments.`)
  }

  // validate selected target environment
  if (!regexVal(envTemplate, targetEnv)) {
    throw new Error(
        `The target environment '${envName}' in ~/${vpconfigName} contains invalid properties. Please use 'viewport config\' to configure target environments.`);
  }

  return targetEnv;
}