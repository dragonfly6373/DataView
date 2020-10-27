const through2 = require('through2');
const gutil = require('gulp-util');
const path = require('path');
const SEP = path.sep;
const PluginError = gutil.PluginError;
const CWD = process.cwd();

const WRAPPER = {
    'amd': 'define("{modName}", function(require, exports, module){' +
    '{file}' +
    '});'
};

module.exports = function (opt) {
    opt = opt || {};
    var truncatePrefixLen = opt.truncatePrefixLen || 0;

    if (opt.type) {
        opt.wrapper = WRAPPER[opt.type];
    }

    return through2.obj(function (file, enc, callback) {

        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback(new PluginError('gulp-wrapper', 'stream is not supported'), file);
        }

        var content = file.contents.toString();
        var fp = file.path;
        var extname;
        var modName;

        if (opt.nameReplacer) {
            file.modName = opt.nameReplacer(file.path);
        } else {
            extname = path.extname(fp);
            modName = fp.replace(CWD + SEP, '').replace(extname, '');

            if (truncatePrefixLen > 0) {
                modName = modName.split(SEP).slice(truncatePrefixLen).join(SEP);
            }
            file.modName = modName;
        }
        if (typeof opt.wrapper === 'function') {
            content = opt.wrapper(content, file);
        } else if (typeof opt.wrapper === 'string') {
            content = opt.wrapper.replace('{file}', content).replace('{modName}', modName);
        }

        file.contents = new Buffer(content);

        callback(null, file);
    });
};