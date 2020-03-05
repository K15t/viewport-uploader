# Roadmap

## Misc

- progress bar for upload: get notified by file stream in form-data, use total file size as reference

## ESNext

- Make doesThemeExist private
- Make `exists()` private (as of ES2020 methods this is still a [proposal](https://github.com/tc39/proposal-private-methods))
- Use async functions already in constructor to compute doesThemeExist and themeId
- Use ES6 export default for `ViewportTheme` and export for `PLUGIN_NAME`