# Roadmap

## Dev ToDo

- ? use only showPluginError ?

## Check

- Return promise in viewportTheme.create that resolves if theme could be created / already is created, rejects otherwise
  then only `return viewportTheme.create();` in `create` task in `gulpfile.js`
- Does viewportTheme.upload() return stream or why can pipe ?
- Difference if pipes to upload before or after dest write ?
- Remove unnecessary SCOPE theme property ?
- upload everything to root of VPRT, frameworks, targetPath?

## NPM Package

- ? bundle with viewport-tools to make only one package ?
