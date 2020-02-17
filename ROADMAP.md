# Roadmap

## Dev ToDo

- ? use only showPluginError ?
- ? use stream.emit("error") for stream ?
- ? use form-data in upload() ? 

## Check

- Return promise in viewportTheme.create that resolves if theme could be created / already is created, rejects otherwise
  then only `return viewportTheme.create();` in `create` task in `gulpfile.js`
- Does viewportTheme.upload() return stream or why can pipe ?
- Difference if pipes to upload before or after dest write ?
- Remove unnecessary SCOPE theme property ?
- upload everything to root of VPRT, frameworks, targetPath?

## NPM Package

- ? bundle with viewport-tools to make only one package ?

## Check Gulp Plugin Guidelines

[Guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md)

- 7: Do not throw errors inside a stream. Instead, you should emit it as an error event.