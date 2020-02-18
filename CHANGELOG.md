# Changelog

## 3.0.0

### Renaming

As per the [guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md) for gulp plugins:

> 1. Your plugin should not do something that can be done easily with an existing node module
>   - For example: deleting a folder does not need to be a gulp plugin. Use a module like [del](https://github.com/sindresorhus/del) within a task instead.
>   - Wrapping every possible thing just for the sake of wrapping it will pollute the ecosystem with low quality plugins that don't make sense within the gulp paradigm.
>   - gulp plugins are for file-based operations! If you find yourself shoehorning a complex process into streams just make a normal node module instead.
>   - A good example of a gulp plugin would be something like gulp-coffee. The coffee-script module does not work with Vinyl out of the box, so we wrap it to add this functionality and abstract away pain points to make it work well within gulp.

- `gulp-viewport` doesn't do anything with file streams. It doesn't need to be a gulp plugin. It should be a simple node module to upload resources to Scroll Viewport.
- it is _not_ intended to be piped
- much simpler logic, can again throw errors without worrying to stop a pipe

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