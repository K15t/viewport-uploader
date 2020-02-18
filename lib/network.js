"use strict";

// ----------------- Dependencies ----------------- //

const fetch = require('node-fetch');
const { showError } = require('./chalk.js');

// ----------------- Exports ----------------- //

exports.fetchTheme = fetchTheme;
exports.existsTheme = existsTheme;
exports.createTheme = createTheme;
exports.resetTheme = resetTheme;

function fetchTheme() {
    return fetch(this.restUrlForThemeObject,
        {
            method: 'GET',
            headers: { 'Authorization': this.autorisation }
        })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotFound.bind(this))
        .then(response => response.json());
}

function existsTheme() {
    return fetch(this.restUrlForThemeObject,
        {
            method: 'GET',
            headers: { 'Authorization': this.autorisation }
        })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(response => response.status == 200);
}

function createTheme() {
    return fetch(this.restUrlForThemeCreation,
        {
            method: 'POST',
            headers: { 'Authorization': this.autorisation, 'Content-Type': 'application/json' },
            body: JSON.stringify({ addStarterFiles: false, name: this.themeName, scope: this.scope })
        })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotCreated.bind(this));
}

function resetTheme() {
    return fetch(this.restUrlForThemeResources,
        {
            method: 'DELETE',
            headers: { 'Authorization': this.autorisation }
        })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotReset.bind(this));
}

function uploadTheme(files, locations) {
    return fetch(this.restUrlForThemeResources,
        {
            method: 'POST',
            headers: { 'Authorization': this.autorisation, 'Content-Type': 'multipart/form-data' },
            body: { files, locations }
        })
        .then(checkPermissionError.bind(this))
        .then(checkAuthenticationError.bind(this))
        .then(checkThemeNotUploaded.bind(this))
        .then(response => response.json()); // ToDo: Check???
}


// ----------------- Error checking ----------------- //

    function checkAuthenticationError(response) {
        if (response.status == 401) {
            showError(`Authentication error. Scope: ${this.scope ||
            'GLOBAL'}. Make sure username \'${this.username}\' and password \'${this.passive}\' are correct.`);
        }
        return response; // for promise chain to continue if doesn't throw
    }

    function checkPermissionError(response) {
        if (response.status == 403) {
            showError(
                `Permission error. Scope: ${this.scope || 'GLOBAL'}. Make sure user \'${this.username}\' has the necessary permissions.`);
        }
        return response; // for promise chain to continue if doesn't throw
    }

    function checkThemeNotFound(response) {
        if (response.status != 200) {
            showError(
                `Can not find theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
        }
        return response; // for promise chain to continue if doesn't throw
    }

    function checkThemeNotCreated(response) {
        if (response.status != 200) {
            showError(
                `Can not create theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
        }
        return response; // for promise chain to continue if doesn't throw
    }

    function checkThemeNotReset(response) {
        if (response.status != 204) {
            showError(
                `Can not reset theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
        }
        return response; // for promise chain to continue if doesn't throw
    }

    function checkThemeNotUploaded(response) {
        if (response.status != 201) {
            showError(
                `Can not upload resources to theme \'${this.themeName}\' at \'${this.confluenceBaseUrl}\': ${response.status} - ${response.statusText}.`)
        }
        return response; // for promise chain to continue if doesn't throw
    }