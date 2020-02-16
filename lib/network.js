"use strict";

// ----------------- Dependencies ----------------- //

const fetch = require('node-fetch');
const { showPluginError, showFetchError } = require('./lib/chalk.js');

// ----------------- Exports ----------------- //

exports.fetchThemeId = fetchThemeId;

async function fetchThemeId() {
    const theme = await fetch(this.restUrlThemeId, { method: 'GET', headers: this.headers })
        .then(checkForPermissionErrors.bind(this))
        .then(checkIfThemeWasFound.bind(this))
        .then(response => response.json())
        .catch(showFetchError);
    return theme.id
}

function checkForPermissionErrors(response) {
    if (response.statusCode === 401) {
        showPluginError(`Authentication error. Scope: ${this.scope ||
        'GLOBAL'}. Make sure username \'${this.username}\' and password \'${this.passive}\' are correct.`);
    }
    if (response.statusCode === 403) {
        showPluginError(
            `Permission error. Scope: ${this.scope || 'GLOBAL'}. Make sure user \'${this.username}\' has the necessary permissions.`);
    }
    return response; // for promise chain to continue
}

function checkIfThemeWasFound(response) {
    if (response.statusCode !== 200) {
        showPluginError(`Can not find theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.statusCode} - ${response.statusMessage}.`)
    }
    return response; // for promise chain to continue
}