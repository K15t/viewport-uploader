"use strict";

const through = require('through2');
const PluginError = require('plugin-error');
const slash = require("slash"); // ToDo: Can't use path.join() for URLs since on windows / would be \\

const PLUGIN_NAME = 'gulp-example';

// To be a valid gulp plugin a plugin needs to be able to be piped, i.e. read and return a file stream
// gulp-viewport shouldn't be a gulp-plugin but a normal node module instead but now it's too late (see rule 1 of the gulp plugin
// guidelines) So at least we read and return the files that are passed in even if we don't modify them

// except upload function doesn't use file stream at all

// ToDo: figure out how can manipulate "this" from within returned through.obj(), or simply make .exists() method private

// creates theme in Scroll Viewport
function create() {

    // close over that, because this inside returned function is different
    const that = this;

    return through.obj((file, encoding, callback) => {

        // hand file stream through so others can pipe on to it
        callback(null, file);

    }, callback => {
        // use flush function to run only once after file stream is done instead of for each file

        (async () => {
            try {
                showLog(`Creating theme '${that.themeName}' in Scroll Viewport...`);

                if (await that.exists()) { // ToDo: get out
                    showLog(`Will not create theme \'${that.themeName}\' since it already exists.`);
                    // don't throw otherwise other methods are unusable since themeId is not set yet
                    // showError(`Can not create theme \'${this.themeName}\' since it already exists.`)
                } else {
                    await createTheme.apply(that);
                    showLog(`The theme '${that.themeName}' has been successfully created.`);
                }

                // set themeId such that upload() and reset() can use it
                const theme = await fetchTheme.apply(that);
                that.themeId = theme.id; // ToDo: get out

                // hand file stream through so others can pipe on to it
                callback(null);

            } catch (error) {
                callback(new PluginError(PLUGIN_NAME, error));
            }
        })();

    });
}


// removes all resources from theme in Scroll Viewport
function reset() {

    // close over that, because this inside returned function is different
    const that = this;

    return through.obj((file, encoding, callback) => {

        // hand file stream through so others can pipe on to it
        callback(null, file);

    }, callback => {
        // use flush function to run only once after file stream is done instead of for each file

        (async () => {
            try {
                showLog(`Resetting theme '${that.themeName}' in Scroll Viewport...`);

                if (!await that.exists()) { // ToDo: get out
                    callback(new PluginError(PLUGIN_NAME,
                        `Can't reset resources since theme \'${that.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`));
                }

                await resetTheme.apply(that);

                showLog(`The theme '${that.themeName}' has been successfully reset.`);

                // hand file stream through so others can pipe on to it
                callback(null);
            } catch (error) {
                callback(new PluginError(PLUGIN_NAME, error));
            }
        })();

    });
}

// uploads resources to theme in Scroll Viewport
function upload() {

    // close over that, because this inside returned function is different
    const that = this;

    // queue files to upload all at once
    // actually contradicts the purpose of a stream
    const filesToUpload = [];

    return through.obj((file, encoding, callback) => {

            // file.contents is empty, nothing to do
            if (file.isNull()) {
                callback(null, file);
                return;
            }

            // file.contents is a Stream
            // if (file.isStream()) {
            //     callback(new PluginError(PLUGIN_NAME, 'Streams not supported!'));
            // }

            // else means file.contents is a Buffer

            // ToDo: remove sourceBase in favor of file.history, targetPath in favor of file.history
            //   'that' can be extended with following options
            //             {
            //                 sourceBase: 'build/css/main.css',
            //                 targetPath: 'css/main.css'
            //             }

            // ToDo: fix what it does
            console.log("file.history[0]: ", file.history[0]);
            const sourceBase = slash(path.relative(that.sourceBase, file.history[0]));
            const relativeSourceFilePath = slash(path.relative(process.cwd(), file.history[0]));
            const sourceBasedFilePath = slash(path.relative(that.sourceBase, relativeSourceFilePath));
            const targetPathFilePath = slash(path.relative(that.targetPath, sourceBasedFilePath));
            const targetPathStart = slash(path.relative(process.cwd(), that.targetPath));

            const targetPath = that.targetPath.match(/\.\w+?$/) ? targetPathStart : targetPathFilePath;
            const sourceBasePath = that.sourceBase.match(/\.\w+?$/) ? that.sourceBase : relativeSourceFilePath;

            // add file to upload queue
            filesToUpload.push(
                {
                    path: targetPath,
                    file: fs.createReadStream(sourceBasePath)
                }
            );

            // hand file stream through so others can pipe on to it
            callback(null, file);

        }, callback => {
            // use flush function to run only once after file stream is done instead of for each file

            (async () => {
                    try {
                        showLog(`Uploading resources to theme '${that.themeName}' in Scroll Viewport...`);

                        if (filesToUpload.length) {
                            const files = filesToUpload.map(item => item.file);
                            const locations = filesToUpload.map(item => item.path);

                            if (!await that.exists()) { // ToDo: get out
                                callback(new PluginError(PLUGIN_NAME,
                                    `Can't update resources since theme \'${that.themeName}\' doesn't exist yet in Scroll Viewport. Please create it first.`));
                            }

                            const uploadedFiles = await uploadTheme.apply(that, filesToUpload);
                        }

                        showLog(`${uploadedFiles.length} resources for the theme '${that.themeName}' have been successfully uploaded.`);

                        callback(null);
                    } catch
                        (error) {
                        callback(new PluginError(PLUGIN_NAME, error));
                    }
                }
            )
            ();

        }
    )
}

function createOrReset() {
    // do some closed over stuff
    return through.obj((file, encoding, callback) => {

        // do some async stuff for each file
        (async () => {
            try {

            } catch (error) {
                callback(new PluginError(PLUGIN_NAME, error));
            }
        })();

        callback(null, file);
    });
}