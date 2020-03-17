# Changelog

## 3.0.0

> `viewport-uploader` is the new `gulp-viewport`.

Years have passed but `gulp-viewport` finally receives an update. 🎉 But not just any update. An update so big that it needed to change its name. "Why on earth would a package need to change its name?" you might ask.

Well, `gulp-viewport` was actually never a good gulp plugin. To be a gulp plugin, you have to do something useful in the pipe, in other words you have to modify the file stream. Otherwise you are just useless for the pipe and could just as well be a separate task. Now all methods of `gulp-viewport` except `upload()` didn't even support piping, and the latter didn't do anything with the stream other than to give it back. And not only that, but `upload()` also buffered the files from the stream to only upload them at once after the stream has went through, defying the whole purpose of having a stream in the first place.

Rule No. 1 of the [Gulp plugin guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md) states it quite clearly:

> **Your plugin should not do something that can be done easily with an existing node module**
>   - For example: deleting a folder does not need to be a gulp plugin. Use a module like [del](https://github.com/sindresorhus/del) within a task instead.
>   - Wrapping every possible thing just for the sake of wrapping it will pollute the ecosystem with low quality plugins that don't make sense within the gulp paradigm.
>   - **gulp plugins are for file-based operations! If you find yourself shoehorning a complex process into streams just make a normal node module instead.**
>   - A good example of a gulp plugin would be something like gulp-coffee. The coffee-script module does not work with Vinyl out of the box, so we wrap it to add this functionality and abstract away pain points to make it work well within gulp.

Now it took us some time to realise our mistakes, but we don't want to be a bad plugin and we don't want to pollute a nice ecosystem. The problem is that the name of an existing package can't be changed. So the only sensible choice was to deprecate the existing package in favour of a new package. The new package `viewport-uploader` is now proudly admitting to not be a gulp plugin, but instead an ordinary node module. Its methods don't support piping, as it should have always been.

"Now what happens with my gulp workflow" you might ask? Nothing! `viewport-uploader` can still be used with gulp, as can any other node module out there. It just won't be in a pipe but instead in a separate task. As `viewport-uploader` doesn't manipulate the file stream it really makes no sense to be in it. The main purpose of uploading files to Scroll Viewport can as well be done from outside the pipe. Imagine you could select files using globs just like with `src()` and use its methods asynchronously in `series()` or `parallel()` calls. Wouldn't that be great? Well, we thought so too and rewrote `viewport-uploader` from the ground up to be asynchronous and to support globs. Now the reason to be in a pipe to get the files nicely delivered from `src` becomes obsolete, because you can just reuse the same globs as arguments for `upload()`. Also `viewport-uploader` is compatible with the newest versions of Node (v13 at time of writing) and the new `viewport-cli` v1 which has undergone a similarly big update. Further the code is cleaned up and uses contemporary dependencies. It gives us also more freedom, like that in a pipe one shouldn't throw errors, since it breaks the whole pipe for everyone, but outside it's fine. Or that the class class instance the `upload()` method is called on couldn't be manipulated from within the returned stream object (because `this` changed). In the end this was the right call and we call it `viewport-uploader`.

### Details

- Rewritten from scratch
    - with ES6 syntax, strict mode, `const` variables
    - much cleaner code, split into modules    
- All methods are async and return promises
- Integrates with new `.vpconfig.json` created by `viewport-cli` (see `viewport-cli` for full documentation on changes)
    - accepts only `envName` and `themeName`, target environment is then loaded from `.vpconfig.json`, much easier for `viewport-cli` to create themes
    - add more robust validation check (same as in `viewport-cli`)
    - remove nested properties, e.g. `mytheme.options.target.confluenceBaseUrl` in favor of flat properties
- Old dependencies have been replaced or removed if possible
    - replaced `request` with `node-fetch` and `form-data`
    - removed `gulp-utils`, `through2` (no streams!), `home-config`, and some others
- Removed "example" theme (see `viewport-cli` "default" theme instead)
   
#### constructor

- Removed `themeId` argument in favor of loading it on first `create()` call, less complex to have only one variable (doesThemeExist) instead of two (doesThemeExist, themeId) for which need to check independently before can safely run any method.

#### `upload()` method

- Removed piping support in Vinyl stream (see intro above)
- Takes globs, `targetPath` and `sourcePath` as arguments, replaces hardcoded ones in config file, can change for each call
- Remove event emitter, don't need anymore, promises already do the notification when it is done