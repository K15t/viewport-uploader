"use strict";

// ----------------- Dependencies ----------------- //

const path = require('path');
const os = require('os');
const { loadConfig } = require('./lib/files.js');
const { fetchTheme, existsTheme, createTheme } = require('./lib/network.js');
const { regexVal } = require('./lib/validate.js');
const { showThemeCreated, showPluginError } = require('./lib/chalk.js');

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
    'targetPath': /^(\.\/|\/)(\w+\/)*$/i,
    'sourcePath': /^(\.\/|\/)(\w+\/)*$/i
};

const RESTURL_BASE = `/rest/scroll-viewport/1.0`;
const getRestUrlForThemeObject = (baseUrl, themeName, scope) => baseUrl + `/theme?name=${themeName}&scope=${scope}`;
const getRestUrlForThemeCreation = (baseUrl) => baseUrl + `/theme`;
const getRestUrlForThemeResources = (baseUrl, themeId) => baseUrl + `/theme/${themeId}/resource`;


// ----------------- Class ----------------- //

class ViewportTheme {

    constructor(themeName, envName) {
        // themeId doesn't need to be provided, can use themeName instead

        // validate themeName or themeId
        if (!themeName || !envName) {
            showPluginError(`Can't initialize ViewportTheme instance since themeName or envName are missing. Please provide both.`)
        }

        // load target environment from config file
        const targetEnv = loadConfig(
            { 'envName': envName, 'vpconfigName': vpconfigName, 'vpconfigPath': vpconfigPath, 'envTemplate': envTemplate });

        // validate target environment, if targetEnv passes check contains exactly the properties of envTemplate
        if (!regexVal(envTemplate, targetEnv)) {
            showPluginError(
                `The target environment '${envName}' in ~/${vpconfigName} contains invalid properties. Please use 'viewport config\' to configure target environments.`);
        }

        // copy properties of targetEnv into 'this'
        const envTemplateKeys = Object.keys(envTemplate);
        envTemplateKeys.forEach(item => {
            this[item] = targetEnv[item]
        });
        this.themeName = themeName;

        showThemeCreated({ 'envName': this.envName, 'themeName': this.themeName });
    }

    // use getters for properties that depend on others to keep it dynamic
    get headers() {
        return { 'Authorization': 'Basic ' + Buffer.from(this.username + ':' + this.password).toString('base64') };
    }

    get restUrlBase() {
        return this.confluenceBaseUrl + RESTURL_BASE;
    }

    get restUrlForThemeObject() {
        return getRestUrlForThemeObject(this.restUrlBase, this.themeName, this.scope);
    }

    get restUrlForThemeCreation() {
        return getRestUrlForThemeCreation(this.restUrlBase);
    }

    get restUrlForThemeResources() {
        if (!this.themeId) {
            showPluginError(
                `Can't build REST URL for theme resources because themeId isn't initialised yet. Please create the theme first.`)
        }
        return getRestUrlForThemeResources(this.restUrlBase, this.themeId);
    }

    // checks if a theme exists in Scroll Viewport
    // ToDo: Make private with ESNext, or a getter method
    #doesThemeExist; // private property to store if theme exists
    async exists() {

        console.log(`Checking if theme \'${this.themeName}\' exists in Scroll Viewport...`);

        // on first run set if theme exists or not
        if (this.#doesThemeExist === undefined) {
            this.#doesThemeExist = await existsTheme.apply(this);
        }

        console.log(`The theme \'${this.themeName}\' does ${this.#doesThemeExist ? 'exist' : 'not exist'} in Scroll Viewport.`);
        return this.#doesThemeExist;
    };

// ToDo: create
    // creates theme in Scroll Viewport
    async create() {
        console.log(`Creating theme '${this.themeName}' in Scroll Viewport...`);

        if (await this.exists()) {
            showPluginError(`Can not create theme \'${this.themeName}\' since it already exists.`)
        }

        const kkk = await createTheme.apply(this);

        // ToDo: set themeId
        // this.themeId = fetchThemeId.apply(this);
        return;
    }

    // ToDo: update
    // overwrites existing resources with new ones in Scroll Viewport
    async upload() {
        console.log(`Uploading resources to theme '${this.themeName}' in Scroll Viewport...`);

        if (!await this.exists()) {
            showPluginError(
                `Can't update resources since theme \'${this.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`)
        }

        // can access themeId since theme exists
        return;
    }

    // ToDo: reset
    // removes all resources in Scroll Viewport
    async reset() {
        console.log(`Resetting theme '${this.themeName}' in Scroll Viewport...`);

        if (!await this.exists()) {
            showPluginError(
                `Can't reset resources since theme \'${this.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`)
        }

        // can access themeId since theme exists
        return;
    }
}

exports.ViewportTheme = ViewportTheme;