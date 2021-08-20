# Viewport Uploader

[![Latest Version](https://img.shields.io/npm/v/@k15t/viewport-uploader)](https://www.npmjs.com/package/@k15t/viewport-uploader)

## Introduction

The *viewport-uploader* package is a node module to upload local resources to Scroll Viewport App inside Atlassian Confluence. For example, it can be used as part of a webpack build process to automate building and uploading a theme.

Note: *viewport-uploader* was formerly known as *gulp-viewport*. Read more about the name change in the [CHANGELOG](CHANGELOG.md).

## Getting started with Scroll Viewport theme development

See the [basic example](examples/basic/README.md) on how to use viewpoort-uploader with webpack as a starting point for Scroll Viewport theme development.

## Create Environment Config

Viewport Uploader uses Confluence environments specified in `~/.vpconfig.json`. Use this file to provide credentials and Confluence base url that will be used for uploading.

Create the file `.vpconfig.json` in your home directory and add your Confluence environments similar to the example below.

``` json
// ~/.vpconfig.json

{
  "DEV": {
    "envName": "DEV",
    "confluenceBaseUrl": "http://localhost:8090/confluence",
    "username": "admin",
    "password": "admin",
    "spaceKey": ""
  },
  "PROD": {
    "envName": "PROD",
    "confluenceBaseUrl": "https://example.com/confluence",
    "username": "admin",
    "password": "admin",
    "spaceKey": "prodspace"
  }
}
```

| Properties | Types  | Description |
|---|---|---|
| `envName` | String | Name of target environment. This should also be the name of the identifier. |
| `confluenceBaseUrl` | String | URL of Confluence Server. It may not contain a trailing slash. |
| `username` | String | Username for Confluence Server |
| `password` | String | Password for Confluence Server |
| `spaceKey` | String | Space key (empty for global). It may contain up to 225 alphanumeric characters. <br /> :warning: &nbsp; Scroll Viewport treats space keys case-sensitive even though for Confluence they are case-insensitive. If you provide the wrong case, the upload will fail without a helpful error message. |


## API Documentation

The `ViewportTheme` class provides methods for uploading resources to Scroll Viewport.

### Getting started

This is a full example of how viewport uploader works. See the sections below for further details.

``` javascript
const ViewportTheme = require('@k15t/viewport-uploader');

// Initialize the theme instance
const themeOptions = {
    // identifies the theme in the Scroll Viewport app
    themeName: 'my-viewport-theme', 

    // identifies the environment inside the `~/.vpconfig.json`
    envName: 'DEV' 
}

const theme = new ViewportTheme(themeOptions);

// Upload theme code
const uploadOptions = {
    glob: 'build/',
    sourcePath: 'build/',
    targetPath: ''
}

theme.upload(uploadOptions, true);

```

### Initialize a `ViewportTheme` instance

``` javascript
const ViewportTheme = require('@k15t/viewport-uploader');

const theme = new ViewportTheme({
    themeName: 'my-viewport-theme',
    envName: 'DEV'
});
```

| Property | Type | Description | Required |
|---|---|---|---|
| `themeName` | String | Name of the theme in Scroll Viewport | true |
| `envName` | String | Name of the target environment that is used from `~/.vpconfig.json` | true |

### Initialize a `ViewportTheme` instance – Using environmental variables

Alternatively environmental variables can be set. This is especially useful for CI/CD pipelines. If all of the following environmental variables are set, they will be preferred. Argument options from eg `~/.vpconfig.json` will be ignored.

| Environmental Variables | Description |
|---|---|
| `VPRT_THEMENAME` | Name of the theme in Scroll Viewport | 
| `VPRT_ENV` | Name of the target environment that is used from `~/.vpconfig.json` |
| `VPRT_CONFLUENCEBASEURL` | see [Create Environment Config](#create-environment-config) for more Information |
| `VPRT_USERNAME` | see [Create Environment Config](#create-environment-config) for more Information |
| `VPRT_PASSWORD` | see [Create Environment Config](#create-environment-config) for more Information |
| `VPRT_SPACEKEY` | see [Create Environment Config](#create-environment-config) for more Information |

### Methods

All methods are async methods that return a promise.


**Create a theme**

``` javascript
// Creates a theme with the `themeName` in Scroll Viewport

await theme.create();
```

Must be run before any other method as it initialises internal variables required by `reset()` and `upload()`.

---

**Check if a theme exist**

``` javascript
// Checks if a theme with the `themeName` exists in Scroll Viewport

await theme.exists();
```
Is executed at the beginning of every method, i.e. no need to run it on it's own, every method has existence check built in.

---

**Reset a theme**

``` javascript
// Resets a theme with the `themeName` in Scroll Viewport, deletes all resources but doesn't delete the theme itself

await theme.reset();
```

---

**Upload a theme**

``` javascript
await theme.upload({
    glob: 'build/',
    sourcePath: 'build/',
    targetPath: ''
}, true);
```

| properties | Type | Description | Required |
|---|---|---|---|
| `glob` | String | File path pattern of resources that should be uploaded, path is taken relative to the CWD, e.g. `build/images/*.jpg`. | true |
| `targetPath` | String | Directory path where the resources should be deployed to, path is taken relative to the theme base URL e.g. `x/y/` results in files being uploaded to `<themeBaseUrl>/x/y/build/images/*.jpg` | true |
| `sourcePath` | String | Directory path which should be "subtracted" from glob path when uploading, path is taken relative to the CWD, e.g. `build/images/` results in files being uploaded to `<themeBaseUrl>/x/y/*.jpg` | true |
| `verbose` | Boolean | __Optional__, if set to `true` enables detailed logging of the files that are uploaded | false |

:warning: &nbsp; **Paths should follow this pattern:**
``` sh
# Correct: path with a trailing slash and without a leading slash
your/custom/path/

# Incorrect:
/your/custom/path/
/your/custom/path
your/custom/path
```
