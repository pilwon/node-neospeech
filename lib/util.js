/*
 * lib/util.js
 */

var childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    stringDecoder = require('string_decoder'),
    util = require('util');

var _ = require('lodash');

function convert(params, cb) {
  params = (_.isObject(params) ? params : {});
  cb = (_.isFunction(cb) ? cb : function (err, result) {
    if (err) { return console.error(err); }
    console.log(result);
  });

  _.defaults(params, {
    pathFrom: null,
    pathTo: null,      // can be detected given `formatTo`
    formatFrom: null,  // can be detected given `pathFrom`
    formatTo: null,    // can be detected given `pathTo`
    keep: true
  });

  // Detect `formatFrom` given `pathFrom`
  if (!params.formatFrom) {
    if (params.pathFrom) {
      params.formatFrom = path.extname(params.pathFrom).slice(1);
    } else {
      return cb('Missing required parameter: "formatFrom" or "pathFrom"');
    }
  }

  // Detect `formatTo` given `pathTo`
  if (!params.formatTo) {
    if (params.pathTo) {
      params.formatTo = path.extname(params.pathTo).slice(1);
    } else {
      return cb('Missing required parameter: "formatTo" or "pathTo"');
    }
  }

  // Detect `pathTo` given `formatTo`
  if (!params.pathTo) {
    if (params.formatTo) {
      params.pathTo = util.format('%s.%s',
        params.pathFrom.slice(0, params.pathFrom.length - path.extname(params.pathFrom).length),
        params.formatTo.toLowerCase()
      );
    } else {
      return cb('Missing required parameter: "pathTo" or "formatTo"');
    }
  }

  // Ensure format parameter values are in the upper case.
  params.formatFrom = params.formatFrom.toUpperCase();
  params.formatTo = params.formatTo.toUpperCase();

  // Validation
  if (!params.pathFrom) {
    return cb('Missing required parameter: "pathFrom"');
  }
  if (!_.contains(['PCM'], params.formatFrom)) {
    return cb('Unsupported formatFrom: ' + params.formatFrom);
  }
  if (!_.contains(['WAV', 'MP3', 'OGG', 'M4A'], params.formatTo)) {
    return cb('Unsupported formatTo: ' + params.formatTo);
  }

  fs.exists(params.pathFrom, function (exists) {
    if (!exists) {
      return cb('File does not exist: ' + params.pathFrom);
    }

    childProcess.exec('which ffmpeg', function (err, stdout, stderr) {
      if (err) { return cb('Missing program: FFmpeg'); }

      var args = [
        '-f', 's16le',
        '-ar', '16k',
        '-i', params.pathFrom,
        '-y'
      ];

      if (params.formatTo === 'WAV') {
        args.push('-f', 'wav');
      } else if (params.formatTo === 'MP3') {
        args.push('-ab', '160k');
      } else if (params.formatTo === 'OGG') {
        args.push('-acodec', 'libvorbis');
      } else if (params.formatTo === 'M4A') {
        args.push('-ar', '32000');
      } else {
        return cb('Unsupported formatTo: ' + params.formatTo);
      }

      args.push(params.pathTo);

      var ffmpeg = childProcess.spawn('ffmpeg', args),
          decoder = new stringDecoder.StringDecoder('utf8'),
          stdout = [],
          stderr = [];

      ffmpeg.stdout.on('data', function (data) {
        stdout.push(decoder.write(data).replace(/\n$/, '').split('\n'));
      });

      ffmpeg.stderr.on('data', function (data) {
        stderr.push(decoder.write(data).replace(/\n$/, '').split('\n'));
      });

      ffmpeg.on('close', function (code) {
        if (code === 0) {
          return cb(null, {
            // stdout: _.flatten(stdout),
            // stderr: _.flatten(stderr),
            from: {
              path: params.pathFrom,
              format: params.formatFrom
            },
            to: {
              path: params.pathTo,
              format: params.formatTo
            }
          });
        } else {
          return cb(util.format(
            'FFmpeg error code: %d\n%s\n%s',
            code,
            _.flatten(stdout).join('\n'),
            _.flatten(stderr).join('\n')
          ));
        }
      });
    });
  });
}

function _convertFn(formatTo, pathFrom, pathTo, cb) {
      /* _convertFn(pathFrom, cb) */
  if (_.isUndefined(cb) && _.isFunction(pathTo)) {
    cb = pathTo;
    pathTo = void 0;
  }
  convert({
    pathFrom: pathFrom,
    pathTo: pathTo,
    formatTo: formatTo
  }, cb);
}

function m4a(pathFrom, pathTo, cb) {
      /* m4a(pathFrom, cb) */
  _convertFn('M4A', pathFrom, pathTo, cb);
}

function mp3(pathFrom, pathTo, cb) {
      /* m4a(pathFrom, cb) */
  _convertFn('MP3', pathFrom, pathTo, cb);
}

function ogg(pathFrom, pathTo, cb) {
      /* m4a(pathFrom, cb) */
  _convertFn('OGG', pathFrom, pathTo, cb);
}

function wav(pathFrom, pathTo, cb) {
      /* m4a(pathFrom, cb) */
  _convertFn('WAV', pathFrom, pathTo, cb);
}

// Public API
exports.convert = convert;
exports.m4a = m4a;
exports.mp3 = mp3;
exports.ogg = ogg;
exports.wav = wav;
