var path = require('path');

exports.summary = 'Compile stylus files to CSS';

exports.usage = '<src> [options]';

exports.options = {
    "dest" : {
        alias : 'd'
        ,default : '<src>'
        ,describe : 'destination file'
    },

    "charset" : {
        alias : 'c'
        ,default : 'utf-8'
        ,describe : 'file encoding type'
    }
};

exports.run = function (options, done) {
    var src = options.src;
    var dest = options.dest;

    exports.async.eachSeries(exports.files, function(inputFile, callback){
        var outputFile = dest;
        if(exports.file.isDirFormat(dest)){
            outputFile = path.join(dest , path.basename(inputFile) );
            // replace file extname to .css
            outputFile = outputFile.replace('.styl', '.css');
        }

        exports.compileStylus(inputFile, outputFile, options, callback);
    }, done);
};



exports.compileStylus = function(inputFile, outputFile, options, done) {

    var data = exports.file.read(inputFile);
    var stylus = require('stylus');
    var s = stylus(data);

    // Load Nib if available
    try {
        s.use(require('nib')());
    } catch (e) {}

    s.render(function(err, css) {
        if (err) {
            return done(err);
        } 

        if (outputFile) {
            exports.file.write(outputFile, css);
            exports.log(inputFile, ">", outputFile);
        }
        done(null, css);

    });
};
