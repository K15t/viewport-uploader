# Changelog

## 3.0.0

### Summary

- `gulp-viewport` now contains only the raw functionality needed to upload files to Scroll Viewport. Everything that is not needed for this has been removed, e.g. example theme or default values. This functionality is what is provided by `viewport-tools` already. It is much easier to maintain it in one place than in two.

### Details

- removed "example" theme (`viewport-tools` provides "default" theme)
- removed default values, just load `.vpconfig.json` directly (`viewport-tools` provides default values)
- removed environmental variables, weren't used anyways, used as default values but didn't make sense because undefined
- add more robust validation check on `.vpconfig.json` (same as in `viewport-tools`)
- Old dependencies have been replaced:
    - `gulp-utils` replaced for individual modules