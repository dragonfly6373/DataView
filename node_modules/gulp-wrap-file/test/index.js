var wrapper = require('../');
var gutil = require('gulp-util');
var fs = require('fs');
var pjoin = require('path').join;
var should = require('should');
var File = require('vinyl');

require('mocha');

describe('gulp-wrap-file', function () {
    it('test amd wrapper', function (done) {

        var fakeFilePath = pjoin(process.cwd(), '/test/fixtures/file.js');
        var getFakeFile = function (fileContent) {

            return new gutil.File({
                path: fakeFilePath,
                cwd: './test/',
                base: './test/fixture/',
                contents: new Buffer(fileContent || '')
            });
        };

        var fakeFile = getFakeFile("module.exports = { init: function () { }, bindEvent: function () { $('.J_addTodo').on('click', addTodo); } };"),
            stream = wrapper({
                type: 'amd'
            });

        stream.on('data', function (file) {
            file.contents.toString().should.eql(String(fs.readFileSync(fakeFilePath)));
        });

        stream.once('end', function () {
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

    it('test wrapper with module name', function (done) {
        var stream = wrapper({
            wrapper: 'define({modName}, {file});'
        });
        var content = 'function(){console.log("hello world")}'

        stream.on('data', function (file) {
            file.modName.should.eql(file.modName);
        });

        stream.once('end', function () {
            done();
        });

        stream.write(new File({path: 'path/to/test.js', contents: new Buffer(content)}));
        stream.end();
    });

    it('test wrapper with file', function (done) {
        var stream = wrapper({
            wrapper: 'define({file})'
        });

        var content = 'function(){console.log("hello world")}'
        stream.on('data', function (file) {
            file.contents.toString().should.eql('define(function(){console.log("hello world")})');
        });

        stream.once('end', function () {
            done();
        });

        stream.write(new File({path: 'path/to/test.js', contents: new Buffer(content)}));
        stream.end();
    });

    it('test wrapper with function', function (done) {
        var stream = wrapper({
            wrapper: function(fileContent, file) {
                var result = 'module.exports = ' +  fileContent;
                return result;
            }
        });

        var content = 'function(){console.log("hello world")}'
        stream.on('data', function (file) {
            file.contents.toString().should.eql('module.exports = function(){console.log("hello world")}');
        });

        stream.once('end', function () {
            done();
        });

        stream.write(new File({path: 'path/to/test.js', contents: new Buffer(content)}));
        stream.end();
    });

    it('test nameReplacer', function (done) {
        var stream = wrapper({
            type: 'amd',
            nameReplacer: function (p) {
                return 'prefix/'+p;
            }
        });

        var content = 'function(){console.log("hello world")}'
        stream.on('data', function (file) {
            file.modName.should.eql('prefix/path/to/test.js');
        });

        stream.once('end', function () {
            done();
        });

        stream.write(new File({path: 'path/to/test.js', contents: new Buffer(content)}));
        stream.end();
    });

    it('test truncatePrefixLen', function (done) {
        var stream = wrapper({
            type: 'amd',
            truncatePrefixLen: 1
        });

        var content = 'function(){console.log("hello world")}'
        stream.on('data', function (file) {
            file.modName.should.eql('to/test');
        });

        stream.once('end', function () {
            done();
        });

        stream.write(new File({path: 'path/to/test.js', contents: new Buffer(content)}));
        stream.end();
    });
});