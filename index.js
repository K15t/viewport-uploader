"use strict";

// ----------------- Dependencies ----------------- //

const { loadConfig } = require('./lib/files.js');
const { fetchThemeId } = require('./lib/network.js');
const { regexVal } = require('./lib/validate.js');
const { showThemeCreated, showError } = require('./lib/chalk.js');

// ----------------- Configuration ----------------- //

const vpconfigName = ".vpconfig.json";
const vpconfigPath = path.join(os.homedir(), vpconfigName); // absolute path

// ToDo: put in proper restrictions from Scroll Viewport
// Note: If you change something here change it in viewport-tools as well!
const envTemplate = {
    'envName': /.*/i,
    'confluenceBaseUrl': /^(https?):\/\/[^\s$.?#].[^\s]*[^/]$/i,
    'username': /.*/i,
    'password': /.*/i,
    'scope': /.*/i,
    'targetPath': /^(\.\/|\/)?(\w+\/)*$/i,
    'sourcePath': /^(\.\/|\/)?(\w+\/)*$/i
};

const RESTURL_BASE = `/rest/scroll-viewport/1.0`;
const getRestUrlForThemeObject = (baseUrl, themeName, scope) => baseUrl + `/theme?name=${themeName}&scope=${scope}`;
const getRestUrlForThemeCreation = (baseUrl) => baseUrl + `/theme`;
const getRestUrlForThemeResources = (baseUrl, themeId) => baseUrl + `/theme/${themeId}/resource`;


// ----------------- Class ----------------- //

class ViewportTheme {

    constructor({ themeName, themeId, envName }) {
        // themeId doesn't need to be provided, can use themeName instead

        // validate themeName or themeId
        if (!themeName && !themeId) {
            showError(`Can't initialize ViewportTheme instance since themeName and themeId are missing. Please provide at least one.`)
        }

        // load target environment from config file
        const targetEnv = loadConfig(
            { 'envName': envName, 'vpconfigName': vpconfigName, 'vpconfigPath': vpconfigName, 'envTemplate': envTemplate });

        // validate target environment, if targetEnv passes check contains exactly the properties of envTemplate
        if (!regexVal(envTemplate, targetEnv)) {
            showError(
                `The target environment '${envName}' in ~/${vpconfigName} contains invalid properties. Please use 'viewport config\' to configure target environments.`);
        }

        // copy properties of targetEnv into 'this'
        const envTemplateKeys = Object.keys(envTemplate);
        envTemplateKeys.forEach(item => {
            this[item] = targetEnv[item]
        });

        this.themeName = themeName; // could be undefined is themeId was provided

        // compute additional properties
        this.headers = { 'Authorization': 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64') };
        this.restUrlBase = this.confluenceBaseUrl + RESTURL_BASE;

        // ToDo: Don't fetchThemeId before theme is created!
        // fetch themeId if not provided
        if (themeId) {
            this.themeId = themeId;
        } else {
            this.restUrlThemeId = getRestUrlForThemeObject(this.restUrlBase, this.themeName, this.scope);
            this.themeId = fetchThemeId.apply(this);
        }

        showThemeCreated({ 'envName': envName, 'themeName': themeName, 'themeId': themeId });
    }

    // ToDo: create
    create() {
        return;
    }

    // ToDo: exists
    exists() {
        return;
    }

    // ToDo: update
    update() {
        return;
    }

    // ToDo: reset
    reset() {
        return;
    }
}

exports.ViewportTheme = ViewportTheme;