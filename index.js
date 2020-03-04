"use strict";

// ----------------- Dependencies ----------------- //

const path = require('path');
const os = require('os');
const PluginError = require('plugin-error');

// ToDo: use async loadConfig instead of loadConfigSync
const { loadConfig, loadConfigSync, createFormData, resolveGlob } = require('./lib/files');
const { fetchTheme, existsTheme, createTheme, resetTheme, uploadTheme } = require('./lib/network');
const { regexVal, regexValArr } = require('./lib/validate');
const { showLog } = require('./lib/console');

// ----------------- Configuration ----------------- //

// Note: If you change the plugin name here change it in all other files as well
const PLUGIN_NAME = 'viewport-sync';

const vpconfigName = ".vpconfig.json";
const vpconfigPath = path.join(os.homedir(), vpconfigName); // absolute path

// ToDo: put in proper restrictions from Scroll Viewport for envName, username, password
// Note: If you change something in this template object, change it in viewport-tools as well!
const targetEnvTemplate = {
    'envName': /.*/i,
    'confluenceBaseUrl': /^(https?):\/\/[^\s$.?#].[^\s]*[^/]$/i,
    'username': /.*/i,
    'password': /.*/i,
    'spaceKey': /^[a-z0-9]{0,255}$/i, // https://confluence.atlassian.com/doc/space-keys-829076188.html
};

const uploadTemplate = {
    'targetPath': /^(\w+\/)*$/i,
    'sourcePath': /^(\w+\/)*$/i,
    'glob': /.*/i,
};

const targetEnvEV = {
    'envName': 'VPRT_ENV',
    'confluenceBaseUrl': 'VPRT_CONFLUENCEBASEURL',
    'username': 'VPRT_USERNAME',
    'password': 'VPRT_PASSWORD',
    'spaceKey': 'VPRT_SPACEKEY',
};

const themeNameEV = 'VPRT_THEMENAME';

const RESTURL_BASE = `/rest/scroll-viewport/1.0`;
const getRestUrlForThemeObject = (baseUrl, themeName, spaceKey) => baseUrl + `/theme?name=${themeName}&scope=${spaceKey}`;
const getRestUrlForThemeCreation = (baseUrl) => baseUrl + `/theme`;
const getRestUrlForThemeResources = (baseUrl, themeId) => baseUrl + `/theme/${themeId}/resource`;

// ----------------- Class ----------------- //

class ViewportTheme {

    // ------------ Constructor ------------ //

    constructor({ themeName, envName }) {

        // if environmental variable exist, use it
        themeName = process.env[themeNameEV] || themeName;

        // validate that themeName is provided
        if (!themeName) {
            throw new PluginError(PLUGIN_NAME, `Can't initialize ViewportTheme instance since themeName is missing.`)
        }

        let targetEnv;

        // if environmental variables all exist, use them
        if (Object.values(targetEnvEV).every(item => !!process.env[item])) {

            targetEnv = Object.keys(targetEnvTemplate).reduce((acc, item) => {
                acc[item] = process.env[targetEnvEV[item]];
                return acc;
            }, {});

            showLog(
                `The target environment '${process.env.VPRT_ENV}' out of the environmental variables will be used for the theme '${themeName}'.`);

         // if not, use config file if envName is provided
        } else if (envName) {

            // ToDo: with ESNext make async constructor
            // load target environment from config file
            targetEnv = loadConfigSync(envName, vpconfigName, vpconfigPath);

            showLog(`The target environment '${targetEnv.envName}' out of the '${vpconfigName}' config file will be used for the theme '${themeName}'.`);

            // if not, use environmental variables, if they all exist

         // else throw
        } else {
            throw new PluginError(PLUGIN_NAME,
                `Can't initialize ViewportTheme instance since envName or environmental variables are missing.`)
        }

        // validate target environment, if targetEnv passes check contains exactly the properties of targetEnvTemplate
        if (!regexVal(targetEnvTemplate, targetEnv)) {
            throw new PluginError(PLUGIN_NAME,
                `The target environment '${targetEnv.envName}' in ~/${vpconfigName} contains invalid properties. Please use 'viewport config\' to configure target environments.`);
        }

        // set properties of 'this' from targetEnv
        const targetEnvTemplateKeys = Object.keys(targetEnvTemplate);
        targetEnvTemplateKeys.forEach(item => {
            this[item] = targetEnv[item];
        });

        // set remaining properties of 'this'
        this.themeName = themeName;
        // Note: set the following later in create() because JS doesn't support async functions inside constructors (yet)
        this.themeId = undefined;
        this.doesThemeExist = undefined;
    }

    // ------------ Getters ------------ //

    get autorisation() {
        return 'Basic ' + Buffer.from(this.username + ':' + this.password).toString('base64');
    }

    get restUrlBase() {
        return this.confluenceBaseUrl + RESTURL_BASE;
    }

    get restUrlForThemeObject() {
        return getRestUrlForThemeObject(this.restUrlBase, this.themeName, this.spaceKey);
    }

    get restUrlForThemeCreation() {
        return getRestUrlForThemeCreation(this.restUrlBase);
    }

    // call only after create() because it depends on themeId which is computed in create(), i.e. in update() and reset()
    get restUrlForThemeResources() {
        if (!this.themeId) {
            throw new PluginError(PLUGIN_NAME,
                `Can't build REST URL for theme resources because themeId isn't initialised yet. Please create the theme first.`)
        }
        return getRestUrlForThemeResources(this.restUrlBase, this.themeId);
    }

    // ------------ Methods on prototype chain ------------ //

    // ToDo: In ESNext make exists() a private method, or even better a private getter method that closes over doesThemeExist variable so
    // not even class has access to it checks if a theme exists in Scroll Viewport
    async exists() {

        // on first run set if theme exists or not
        if (this.doesThemeExist === undefined) {
            showLog(`Checking if theme \'${this.themeName}\' exists in Scroll Viewport...`);
            this.doesThemeExist = await existsTheme.apply(this);
        }

        showLog(`The theme \'${this.themeName}\' does ${this.doesThemeExist ? 'exist' : 'not exist'} in Scroll Viewport.`);
        return this.doesThemeExist;
    };

    // creates theme in Scroll Viewport
    async create() {

        if (await this.exists()) {
            showLog(`Won't create theme \'${this.themeName}\' since it already exists.`);
            // don't throw otherwise other methods are unusable since themeId is not set yet
            // throw new PluginError(PLUGIN_NAME, `Can not create theme \'${this.themeName}\' since it already exists.`)
        } else {
            showLog(`Creating theme '${this.themeName}' in Scroll Viewport...`);
            await createTheme.apply(this);
            showLog(`The theme '${this.themeName}' has been successfully created.`);
            this.doesThemeExist = true;
        }

        // set themeId such that upload() and reset() can use it
        const theme = await fetchTheme.apply(this);
        this.themeId = theme.id;
    }

    // removes all resources from theme in Scroll Viewport
    async reset() {

        // obligatory existence check
        if (!await this.exists()) {
            throw new PluginError(PLUGIN_NAME,
                `Can't reset resources since theme \'${this.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`)
        }

        showLog(`Resetting theme '${this.themeName}' in Scroll Viewport...`);

        await resetTheme.apply(this);

        showLog(`The theme '${this.themeName}' has been successfully reset.`);
    }

    // overwrites existing resources in theme with new ones in Scroll Viewport
    async upload(options, verbose) {

        // obligatory existence check
        if (!await this.exists()) {
            throw new PluginError(PLUGIN_NAME,
                `Can't update resources since theme \'${this.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`)
        }

        // validate arguments, if options passes check contains exactly the properties of uploadTemplate
        if (!regexValArr(uploadTemplate, options)) {
            throw new PluginError(PLUGIN_NAME,
                `The options passed to upload() are invalid. Please provide options ${Object.keys(uploadTemplate).join(", ")} according to the documentation.`);
        }

        // compute paths
        const { glob, targetPath, sourcePath } = options;

        let sourcePaths = await resolveGlob(glob);

        if (!sourcePaths.length) {
            showLog(`Won't upload since no files matching the glob pattern \'${glob}\' were found.`);
            return; // break out of function, async func returns a resolved promise with value undefined, same as if it finished until end
        }

        const targetPaths = sourcePaths.map(item => path.join(targetPath, path.relative(sourcePath, item)));

        // log upload
        showLog(`Uploading ${sourcePaths.length} resources to theme '${this.themeName}' in Scroll Viewport...`);

        if (verbose === true) {
            sourcePaths.forEach((_, i) => {
                console.log(sourcePaths[i] + " => " + targetPaths[i]);
            });
        } else {
            console.log(glob + " => " + path.join(targetPath, path.relative(sourcePath, glob)));
        }

        // create form data and upload
        const formData = await createFormData(sourcePaths, targetPaths);
        const uploadedFilePaths = await uploadTheme.call(this, formData);

        // log success
        showLog(`The ${uploadedFilePaths.length} resources have been successfully uploaded.`);

        if (verbose === true) {
            uploadedFilePaths.forEach(item => {
                console.log(item);
            });
        }

    }
}

module.exports = ViewportTheme;
