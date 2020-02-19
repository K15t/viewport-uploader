# Roadmap

## Dev ToDo

- ? use only showPluginError ?
- ? use stream.emit("error") for stream ?
- ? use form-data in upload() ? 
- ? Can throw errors outside the pipe ?

## Check

  then only `return viewportTheme.create();` in `create` task in `gulpfile.js`
- Does viewportTheme.upload() return stream or why can pipe ?
- Difference if pipes to upload before or after dest write ?
- Remove unnecessary SCOPE theme property ?
- upload everything to root of VPRT, frameworks, targetPath?

## NPM Package

- ? bundle with viewport-tools to make only one package ? isn't a valid gulp-plugin anyways

## ESNext

- With ESNext make getters private
- Use async functions already in constructor to compute doesThemeExist and themeId