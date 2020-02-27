# Readme

## Introduction

The `viewport-sync` package is a simple node module to upload local resources to Scroll Viewport. For example, it can be used as part of a gulp workflow to automate building and uploading a theme. It was formerly known as `gulp-viewport`. Read more about the name change in the [CHANGELOG](CHANGELOG.md).


## Getting started

To create a local theme development environment for Scroll Viewport, use the interactive `viewport-tools` to get started quickly. The "default" theme template already provides you with a basic build workflow using gulp that makes use of `viewport-sync` to upload the files to Scroll Viewport. If you use `viewport-tools`, you don't have to go through the trouble of setting up `viewport-sync`.


## Documentation

- the `ViewportTheme` class provides the methods for uploading resources to Scroll Viewport
- the target environment is taken either from the `.vpconfig.json` in the home directory or from environmental variables
- for an example how `viewport-sync` can be used, refer to the "default" theme template provided with the `viewport-tools`

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
    - `envName` &lt;string&gt;: name of a target environment in `.vpconfig.json` that is used, leave empty to use environmental variables instead

### Target environment

- target environments are stored in the hidden `.vpconfig.json` in the home directory (use the `viewport-tools` to add and edit)
- an entry must be an object with the following properties
    - `envName` &lt;string&gt;: name of target environment
    - `confluenceBaseUrl` &lt;string&gt;: URL of Confluence Server. It may not contain a trailing slash.
    - `username` &lt;string&gt;: username for Confluence Server
    - `password` &lt;string&gt;: password for Confluence Server
    - `spaceKey` &lt;string&gt;: space key (empty for global). It may contain up to 225 alphanumeric characters. NOTE: Scroll Viewport treats space keys case-sensitive even though for Confluence they are case-insensitive!
- instead of using a `.vpconfig.json` file, the corresponding environmental variables `VPRT_ENV`,`VPRT_CONFLUENCEBASEURL`,  `VPRT_USERNAME`, `VPRT_PASSWORD`, `VPRT_SPACEKEY` can be used. They are only used if _no_ `envName` argument is provided to the constructor.

### Methods

- all methods are async, i.e. they return promises to which an error handler should be attached

#### `exists()`

- checks if a theme with the `themeName` exists in Scroll Viewport
- is executed at the beginning of every method, i.e. no need to run it on it's own, every method has existence check built in.

#### `create()`

- creates a theme with the `themeName` in Scroll Viewport
- must be run before any other method as it initialises internal variables required by `reset()` and `upload()` (is done asynchronously, must be done outside constructor since a constructor can't be async (as of ES2020), `create` does the job of an otherwise separate `init` method)

#### `reset()`

- resets a theme with the `themeName` in Scroll Viewport, deletes all resources but doesn't delete the theme itself

#### `upload(options)`

- uploads given resources to a theme with the `themeName` in Scroll Viewport
- the arguments are an options object containing the following properties:
    - `glob` &lt;string&gt; | &lt;string[]&gt;: file path pattern that should be uploaded, path is taken relative to the CWD, e.g. `build/images/*.jpg`.
    - `targetPath` &lt;string&gt;: directory path where the resources should be deployed to, path is taken relative to confluenceBaseUrl ???, e.g. `x/y/` results in files being uploaded to `confluenceBaseUrl/spaceKey/x/y/build/images/*.jpg`
    - `sourcePath` &lt;string&gt;: directory path which should be "subtracted" from glob path when uploading, path is taken relative to the CWD, e.g. `build/images/` results in files being uploaded to `confluenceBaseUrl/spaceKey/x/y/*.jpg`
- since al paths are relative to the CWD, make sure paths do _not_ contain a leading slash and directory paths _do_ contain a trailing slash. Pass an empty string for the CWD itself, not `/`.


## Roadmap

- see [Roadmap](Roadmap.md)