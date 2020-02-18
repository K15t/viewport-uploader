# Readme

## Introduction

The `gulp-viewport` package is a gulp plugin to upload local resources to Scroll Viewport and can be used as part of a gulp build workflow. You can use the `viewport-tools` package to automate theme creation and set up of a gulp workflow that uses `gulp-viewport`. 

## Documentation

<!-- ToDo: finish -->

### Constructor


- getters are used to compute any dependent properties


### Methods

- all methods are async, i.e. they return promises to which an error handler should be attached

- `exists`: checks if a theme with the `themeName` exists in Scroll Viewport, is executed at the beginning of every method, takes no arguments
- `create`: creates a theme with the `themeName` in Scroll Viewport, fetches the theme to set the `themeId`, takes no arguments
- `reset`: resets a theme with the `themeName` in Scroll Viewport, only deletes all resources, doesn't delete the theme itself, takes no arguments
- `upload`: uploads given resources to a theme with the `themeName` in Scroll Viewport, takes as arguments an object containing the following properties:
    - `globString` &lt;string&gt;: file path pattern that should be uploaded, path is taken relative to the CWD, e.g. `a/b/*.js`.
    - `targetPath` &lt;string&gt;: directory path where the resources should be deployed to, path is taken relative to confluenceBaseUrl ???, e.g. `x/y/` results in `confluenceBaseUrl/x/y/a/b/*.js`
    - `sourcePath` &lt;string&gt;: directory path which should be "subtracted" from glob path, path is taken relative to the CWD, e.g. `a/b/` results in `confluenceBaseUrl/x/y/*.js`
(Note: Relative paths should _not_ contain a leading slash. Directory paths should contain a trailing slash.)


### Configuration

<!-- ToDo: How .vpconfig.json works -->

## Roadmap

- see [Roadmap](Roadmap.md)