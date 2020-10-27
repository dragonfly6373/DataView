# gulp-wrap

[![NPM version](https://img.shields.io/npm/v/gulp-wrap-file.svg?style=flat)](https://www.npmjs.com/package/gulp-wrap-file)
[![Build Status](https://secure.travis-ci.org/daizch/gulp-wrap-file.svg?branch=master)](http://travis-ci.org/daizch/gulp-wrap-file)

> A [gulp](https://github.com/gulpjs/gulp) plugin to wrap a file contents.

## Usage

Firstly, install `gulp-wrap-file` as a development dependency:

```shell
npm install gulp-wrap-file --save-dev
```

Then, add it into your `gulpfile.js`:

**Wrap the commonjs contents with amd:**

```javascript
var wrapper = require("gulp-wrap-file");

gulp.src("./src/**/*.js")
    .pipe(wrap({type: 'amd'}))
    .pipe(gulp.dest("build"));
```

**Wrap the contents by your file wrapper:**

```javascript
var wrap = require("gulp-wrap-file");

gulp.src("./src/**/*.js")
    .pipe(wrap({wrapper: 'define({file});'}))
    .pipe(gulp.dest("build"));
```


**Wrap the contents with modName:**

```javascript
var wrap = require("gulp-wrap-file");

gulp.src("./src/**/*.js")
    .pipe(wrap({wrapper: 'define("src/{modName}",function((require, exports, module){ {file} }));'}))
    .pipe(gulp.dest("build"));
```

## example

### input

```javascript
//input.js
function foo() { console.log("hello world"); }
```

### gulpfile.js

```javascript
var wrap = require("gulp-wrap-file");

gulp.src("input.js")
    .pipe(wrap({wrapper: 'define("demo/{modName}",function((require, exports, module){ {file} }));'}))
    .pipe(gulp.dest("build"));
```

same to the wrapper for function

```javascript
var wrap = require("gulp-wrap-file");

gulp.src("input.js")
    .pipe(wrap({wrapper: function(content, file){
        return 'define("demo/'+file.modName+'",function((require, exports, module){ '+content+' }));'
    }}))
    .pipe(gulp.dest("build"));
```


### output

```javascript
define("demo/input",function((require, exports, module){ function foo() { console.log("hello world"); } }));
```

## Parameters

### type
Type: `String`

To wrap file with default support wrapper. On now, it only supports `amd`.

### wrapper
Type: `String` or `Function`

The file wrapper to wrap your file content. You can get the file content and the pathname of the file.
If wrapper is string, file content names `{file}`, short pathname of the file names `{modName}`.
If wrapper is function, the arguments of the function are content of the file and the file object.

### truncatePrefixLen
Type: `Number`

To truncate the name of the module prefix. For example, if the module name is path/to/foo. The value of truncatePrefixLen is 1, then the result will be to/foo.


### nameReplacer
Type: `Function`

To handle the module name to what you want. With the config of nameReplacer, truncatePrefixLen will be disabled.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)