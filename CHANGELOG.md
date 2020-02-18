# Changelog

## 3.0.0

### Renaming

As per the [guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md) for gulp plugins:

> 1. Your plugin should not do something that can be done easily with an existing node module
>   - For example: *deleting a folder does not need to be a gulp plugin.* Use a module like [del](https://github.com/sindresorhus/del) within a task instead.
>   - Wrapping every possible thing just for the sake of wrapping it will pollute the ecosystem with low quality plugins that don't make sense within the gulp paradigm.
>   - *gulp plugins are for file-based operations! If you find yourself shoehorning a complex process into streams just make a normal node module instead.*
>   - A good example of a gulp plugin would be something like gulp-coffee. The coffee-script module does not work with Vinyl out of the box, so we wrap it to add this functionality and abstract away pain points to make it work well within gulp.

- reading this one realizes that `gulp-viewport` should not be a gulp plugin, because it doesn't manipulate the file stream at all
- `create()` and `reset()` methods didn't even return the file stream i.e. didn't support piping, `upload()` just took the stream to upload it to Scroll Viewport but returned it unchanged
- instead `gulp-viewport` should be a normal node module used in its own "upload" task
- this means simpler code, couldn't manipulate class instance from within `through2` object, couldn't throw errors because the pipe would have been stopped, etc.

### Summary

- `gulp-viewport` now contains only the raw functionality needed to upload files to Scroll Viewport. Everything that is not needed for this has been removed, e.g. example theme or default values. This functionality is what is provided by `viewport-tools` already. It is much easier to maintain it in one place than in two.

- all functions return a promise, replaces the event emitter.

- all methods do _not_ support being piped within a gulp task, instead they are inherently async and return promises, meaning in gulp series() they provide gulp with the information when the task is over and the next can be run, replacing the need for events, better and simpler all in all

### Details

- removed "example" theme (`viewport-tools` provides "default" theme)
- removed default values, just load `.vpconfig.json` directly (`viewport-tools` provides default values)
- removed environmental variables, weren't used anyways, used as default values but didn't make sense because undefined
- add more robust validation check on `.vpconfig.json` (same as in `viewport-tools`)
- Old dependencies have been replaced:
    - `gulp-utils` replaced for individual modules
    
- rewritten, more modern, cleaner
- simplified `ViewportTheme` instance to have properties not nested, e.g. don't need to remember `mytheme.options.target.confluenceBaseUrl` anymore
- removed `themeId` argument in favor of loading it on first `create()` call, less complex to have only one variable (doesThemeExist) instead of two (doesThemeExist, themeId) for which need to check independently before can safely run any method

- all methods are async and return promises
- remove event emitter in favor of promises


- removed targetPath and sourcePath from configuration file in favor of providing them as arguments to upload()