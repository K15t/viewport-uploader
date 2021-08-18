# Basic example 

This example shows how to use viewport-uploader with webpack.

  
## Getting started with Scroll Viewport theme development

:warning: &nbsp; If you don't have a `~/.vpconfig.json` yet see the section [Create Environment Config](../../README.md#create-environment-config) and make sure it contains at least a DEV Confluence environment.

This example contains a basic theme setup, including a `page.vm` for the templating, styles and scripts to edit functionality and appearance of your theme and a webpack configuration to bundle and upload the code.  
  

### 1. Clone this repository and change to this directory `examples/basic`:

``` sh
git clone git@github.com:K15t/viewport-uploader.git

cd example/basic
```

### 2. Install dependencies

``` sh
yarn install
```

### 3. Start development

Start development mode with automatic rebuilds. Once the webpack build has finished the theme will be uploaded to the specified Confluence environment.

``` sh
VPRT_ENV=DEV yarn watch
```

### 4. Upload a development build of your theme

Build and upload a development build (eg contains source maps) to your Confluence instance.

``` sh
VPRT_ENV=DEV yarn upload:dev
```

### 5. Upload a production build to a different Confluence environment

Specify a PROD environment in your `~/.vpconfig.json` first.

``` sh
VPRT_ENV=PROD yarn upload:prod
```

The configuration for the upload can be found in the `webpack.config.js`. For further information on how the upload works see the Viewport Uploader [API Documentation](../../README.md#api-documentation).
