"use strict";

// ----------------- Dependencies ----------------- //

const fetch = require('node-fetch');
const { showPluginError } = require('./chalk.js');

// ----------------- Exports ----------------- //

exports.fetchTheme = fetchTheme;
exports.existsTheme = existsTheme;
exports.createTheme = createTheme;

function fetchTheme() {
    return fetch(this.restUrlForThemeObject, { method: 'GET', headers: this.headers })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotFound.bind(this))
        .then(response => response.json());
}

function existsTheme() {
    return fetch(this.restUrlForThemeObject, { method: 'GET', headers: this.headers })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(response => response.status == 200)
}

// ToDo: Fix why PermissionError
function createTheme() {
    return fetch(this.restUrlForThemeCreation, { method: 'POST', headers: this.headers, json: {addStarterFiles: false, name: this.themeName, scope: this.scope} })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotCreated.bind(this))
        .then(response => {console.log("CREATED:", response); return response;});
}

// ----------------- Error checking ----------------- //

function checkAuthenticationError(response) {
    if (response.status == 401) {
        showPluginError(`Authentication error. Scope: ${this.scope ||
        'GLOBAL'}. Make sure username \'${this.username}\' and password \'${this.passive}\' are correct.`);
    }
    return response; // for promise chain to continue if doesn't throw
}

function checkPermissionError(response) {
    if (response.status == 403) {
        showPluginError(
            `Permission error. Scope: ${this.scope || 'GLOBAL'}. Make sure user \'${this.username}\' has the necessary permissions.`);
    }
    return response; // for promise chain to continue if doesn't throw
}

function checkThemeNotFound(response) {
    if (response.status != 200) {
        showPluginError(`Can not find theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
    }
    return response; // for promise chain to continue if doesn't throw
}

function checkThemeNotCreated(response) {
    if (response.status != 200) {
        showPluginError(`Can not create theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
    }
    return response; // for promise chain to continue if doesn't throw
}