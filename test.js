"use strict";

const { ViewportTheme } = require('./index.js');

const envName = "DEV";
const themeName = "mmmmmmmm";

const vt = new ViewportTheme(themeName, envName);

/*(async function() {
    // await vt.exists();
    await vt.create();
}()).catch(err => console.log(err));*/
// console.log(vt.fetchThemeId());

new Promise((resolve) => setTimeout(resolve, 1000))
    .then(vt.create.bind(vt))
    .then(vt.reset.bind(vt))
    .catch(err => console.log("FUUUUUUU", err));

// example of a REST response
const exampleResponseObject = {
    "id": "C0A8125201701B8EE408456F5B58D29A",
    "name": "test2",
    "pluginDownloadFilename": "test2-1.0.jar",
    "version": "1.0",
    "resources": [{
        "type": "directory",
        "name": "css",
        "children": [{
            "type": "file",
            "name": "main.css",
            "contentType": "text/css",
            "mandatory": false,
            "displayUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/resource/css/main.css",
            "downloadUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/download/css/main.css"
        }]
    }, {
        "type": "file",
        "name": "page.vm",
        "contentType": "application/velocity",
        "mandatory": true,
        "displayUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/resource/page.vm",
        "downloadUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/download/page.vm"
    }, {
        "type": "directory",
        "name": "js",
        "children": [{
            "type": "file",
            "name": "main.js",
            "contentType": "text/javascript",
            "mandatory": false,
            "displayUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/resource/js/main.js",
            "downloadUrl": "http://localhost:8090/confluence/plugins/servlet/scroll-viewport/theme/C0A8125201701B8EE408456F5B58D29A/download/js/main.js"
        }]
    }],
    "mutable": true,
    "configurable": false,
    "viewports": [{
        "spaceKey": "TW",
        "spaceName": "Testport",
        "displayUrl": "http://localhost:8090/confluence/tw",
        "manageUrl": "http://localhost:8090/confluence/spaces/scroll-viewport/config.action?key=TW#/C0A81252017019FF17F6061B71FFDEE7/config/content"
    }]
}

// node-fetch response
// status: 200,
// statusText: 'OK',
// ok (200 <= res.status < 300)