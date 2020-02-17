# Changelog

## 3.0.0

### Summary

- `gulp-viewport` now contains only the raw functionality needed to upload files to Scroll Viewport. Everything that is not needed for this has been removed, e.g. example theme or default values. This functionality is what is provided by `viewport-tools` already. It is much easier to maintain it in one place than in two.

- all functions return a promise, replaces the event emitter.

### Details

- removed "example" theme (`viewport-tools` provides "default" theme)
- removed default values, just load `.vpconfig.json` directly (`viewport-tools` provides default values)
- removed environmental variables, weren't used anyways, used as default values but didn't make sense because undefined
- add more robust validation check on `.vpconfig.json` (same as in `viewport-tools`)
- Old dependencies have been replaced:
    - `gulp-utils` replaced for individual modules
    
- rewritten, more modern, cleaner
- simplified `ViewportTheme` instance to have properties not nested, e.g. don't need to remember `mytheme.options.target.confluenceBaseUrl` anymore
- `ViewportTheme` only uses async methods, i.e. returning promises, no synchronous methods, no callbacks
- removed event emitter in favor of promises
- removed `themeId` argument in favor of loading it when checking for existence