# Readme

## Introduction

The *viewport-sync* package is a node module to upload local resources to Scroll Viewport. For example, it can be used as part of a gulp build process to automate building and uploading a theme. It was formerly known as *gulp-viewport*. Read more about the name change in the [CHANGELOG](CHANGELOG.md).


## Getting started

To create a local theme development environment for Scroll Viewport, use the interactive [viewport-tools](#) to get started quickly. The "default" theme template already provides you with a basic build process using gulp that makes use of *viewport-sync* to upload the files to Scroll Viewport. If you use *viewport-tools*, you don't have to go through the trouble of setting up *viewport-sync*.


## Documentation

- the `ViewportTheme` class provides the methods for uploading resources to Scroll Viewport.
- the target environment is taken either from the `.vpconfig.json` in the home directory or from environmental variables.
- for an example how *viewport-sync* can be used, refer to the "default" theme template provided with the *viewport-tools*.

### Constructor

```javascript
const ViewportTheme = require('gulp-viewport');

const theme = new ViewportTheme({
    themeName: 'my-viewport-theme',
    envName: 'DEV'
});
```

- the arguments are an options object containing the following properties:
    - `themeName` &lt;string&gt;: name of the theme in Scroll Viewport
    - `envName` &lt;string&gt;: name of a target environment in `.vpconfig.json` that is used
- alternatively environmental variables can be set, useful for CI/CD pipelines like Bitbucket
    - `VPRT_THEMENAME`
    - `VPRT_ENV` (here used for error logging only),`VPRT_CONFLUENCEBASEURL`, `VPRT_USERNAME`, `VPRT_PASSWORD`, `VPRT_SPACEKEY`
- if environmental variables are set, will be preferred and argument options ignored, i.e. no `.vpconfig.json` is tried to be loaded

### Target environment

- a target environment is an object containing the following properties, it's identifying name must be equal to it's `envName` property
    - `envName` &lt;string&gt;: name of target environment
    - `confluenceBaseUrl` &lt;string&gt;: URL of Confluence Server. It may not contain a trailing slash.
    - `username` &lt;string&gt;: username for Confluence Server
    - `password` &lt;string&gt;: password for Confluence Server
    - `spaceKey` &lt;string&gt;: space key (empty for global). It may contain up to 225 alphanumeric characters. [^1]
- target environments are stored in the hidden `.vpconfig.json` in the home directory
- use the `viewport-tools config` to create and edit target environments

```json
// example .vpconfig.json
{
  "DEV": {
    "envName": "DEV",
    "confluenceBaseUrl": "http://localhost:8090/confluence",
    "username": "admin",
    "password": "admin",
    "spaceKey": "testspace"
  },
  "PROD": {
    "envName": "PROD",
    "confluenceBaseUrl": "http://localhost:8090/confluence",
    "username": "admin",
    "password": "admin",
    "spaceKey": "prodspace"
  }
}
```

[^1]: **Beware**: Scroll Viewport treats space keys case-sensitive even though for Confluence they are case-insensitive. If you provide the wrong case, the upload will fail. ⚠️

### Methods

- all methods are async, i.e. they return promises to which an error handler should be attached

#### `exists()`

- checks if a theme with the `themeName` exists in Scroll Viewport
- is executed at the beginning of every method, i.e. no need to run it on it's own, every method has existence check built in.

#### `create()`

- creates a theme with the `themeName` in Scroll Viewport
- must be run before any other method as it initialises internal variables required by `reset()` and `upload()`
  (would have been in constructor, but since operation is asynchronous, must be done outside of constructor because as of ES2020 a constructor can't be async, essentially `create` integrates the job of an otherwise separate `init` method)

#### `reset()`

- resets a theme with the `themeName` in Scroll Viewport, deletes all resources but doesn't delete the theme itself

#### `upload(options, verbose)`

- uploads given resources to a theme with the `themeName` in Scroll Viewport
- `options` &lt;object&gt;: mandatory, must contain the following properties:
    - `glob` &lt;string&gt; | &lt;string[]&gt;: file path pattern of resources that should be uploaded, path is taken relative to the CWD, e.g. `build/images/*.jpg`.
    - `targetPath` &lt;string&gt;: directory path where the resources should be deployed to, path is taken relative to the theme base URL [^2] e.g. `x/y/` results in files being uploaded to `<themeBaseUrl>/x/y/build/images/*.jpg`
    - `sourcePath` &lt;string&gt;: directory path which should be "subtracted" from glob path when uploading, path is taken relative to the CWD, e.g. `build/images/` results in files being uploaded to `<themeBaseUrl>/x/y/*.jpg`
    - since all paths are relative to the CWD, make sure paths do _not_ contain a leading slash and directory paths _do_ contain a trailing slash. Pass an empty string for the CWD itself, not `/`.
- `verbose` &lt;boolean&gt;: optional, if set to `true` enables detailed logging of the files that are uploaded

[^2]: See documentation of [viewport-tools](#) on URLs.


## Roadmap

- see [Roadmap](Roadmap.md)