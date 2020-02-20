# Readme

## Introduction

The `viewport-sync` package is a simple node module to upload local resources to Scroll Viewport. For example, it can be used as part of a gulp workflow to automate building and uploading a theme. It was formerly known as `gulp-viewport`. Read more about the name change in the [CHANGELOG](CHANGELOG.md).


## Getting started

To create a local theme development environment for Scroll Viewport, you can use the interactive `viewport-tools` to get started quickly. The "default" theme template already provides you with a basic build workflow using gulp that makes use of `viewport-sync` to upload the files to Scroll Viewport.


## Documentation

<!-- ToDo: finish -->

- for an example how `viewport-sync` can be used, refer to the "default" theme template provided with the `viewport-tools`.

### Constructor

```javascript
const ViewportTheme = require('gulp-viewport');

const theme = new ViewportTheme({
    themeName: 'my-viewport-theme',
    envName: 'DEV'
});
```

- initialised with an options object containing the following properties
    - `themeName` &lt;string&gt;: name of the theme in Scroll Viewport
    - `envName` &lt;string&gt;: name of a target environment in `.vpconfig.json` that is used (see `viewport-tools` documentation for more information on `.vpconfig.json`)

#### Target environment

- target environments are stored in the hidden `.vpconfig.json` in the home directory (use the `viewport-tools` to add and edit)
- an entry in the `.vpconfig.json` must contain an object with the following properties
    - `envName` &lt;string&gt;: name of target environment
    - `confluenceBaseUrl` &lt;string&gt;: URL of Confluence Server
    - `username` &lt;string&gt;: username for Confluence Server
    - `password` &lt;string&gt;: password for Confluence Server
    - `scope` &lt;string&gt;: space key to scope (empty for global)
- instead of using a `.vpconfig.json` file, the corresponding environmental variables `VPRT_ENV`,`VPRT_CONFLUENCEBASEURL`,  `VPRT_USERNAME`, `VPRT_PASSWORD`, `VPRT_SCOPE` can be used. They are only used if _no_ `envName` argument is provided.

### Methods

- all methods are async, i.e. they return promises to which an error handler should be attached

#### `exists()`

- checks if a theme with the `themeName` exists in Scroll Viewport
- takes no arguments
- is executed at the beginning of every method, i.e. no need to run on it's own
- (would be a private method, but as of ES2020 methods this is still a [proposal](https://github.com/tc39/proposal-private-methods))

#### `create()`

- creates a theme with the `themeName` in Scroll Viewport, takes no arguments
- must be run before any other method as it initialises some internal variables
- (since a constructor can't be async, `create` is taking over the role of an `init` method as well)

#### `reset()`

- resets a theme with the `themeName` in Scroll Viewport, only deletes all resources, doesn't delete the theme itself, takes no arguments


#### `upload()`

- uploads given resources to a theme with the `themeName` in Scroll Viewport, takes an options object containing the following properties:
    - `glob` &lt;string&gt; | &lt;string[]&gt;: file path pattern that should be uploaded, path is taken relative to the CWD, e.g. `a/b/*.js`.
    - `targetPath` &lt;string&gt;: directory path where the resources should be deployed to, path is taken relative to confluenceBaseUrl ???, e.g. `x/y/` results in `confluenceBaseUrl/x/y/a/b/*.js`
    - `sourcePath` &lt;string&gt;: directory path which should be "subtracted" from glob path, path is taken relative to the CWD, e.g. `a/b/` results in `confluenceBaseUrl/x/y/*.js`
(Note: Relative paths should _not_ contain a leading slash. Directory paths should contain a trailing slash.)


## Roadmap

- see [Roadmap](Roadmap.md)