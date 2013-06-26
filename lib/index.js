/*
 * lib/index.js
 *
 * util
 *
 * bridget
 * hui
 * julie
 * junwoo
 * kate
 * liang
 * misaki
 * paul
 * show
 * violeta
 * yumi
 *
 * requestBuffer
 * requestBufferEx
 * requestBufferSSMLEx
 * requestFile
 * requestFileEx
 * requestFileSSML
 * requestStatus
 */

'use strict';

var path = require('path');

var _ = require('lodash');

var C = require('./constants'),
    binding = require('../build/Release/neospeech'),
    util = require('./util');

function cbDefault(err) {
  if (err) {
    return console.error(err);
  }
  var args = Array.prototype.slice.call(arguments, 0);
  console.log(JSON.stringify(args.slice(1), null, 2));
}

var NeoSpeech = function (config) {
  this._config = _.isObject(config) ? config : {};

  _.defaults(this._config, {
    host: '127.0.0.1',
    port: 7000
  });
};

/**
 * Expose util module.
 */
NeoSpeech.prototype.util = util;

/**
 * Convenience function.
 */
NeoSpeech.prototype._voiceFn = function (speakerCode, text, outPath, cb) {
  this.requestFileSSML({
    text: text,
    outPath: outPath,
    speakerId: speakerCode
  }, cb);
};

// Convenience functions
NeoSpeech.prototype.bridget = function (text, outPath, cb) {
  this._voiceFn('BRIDGET', text, outPath, cb);
};
NeoSpeech.prototype.hui = function (text, outPath, cb) {
  this._voiceFn('HUI', text, outPath, cb);
};
NeoSpeech.prototype.julie = function (text, outPath, cb) {
  this._voiceFn('JULIE', text, outPath, cb);
};
NeoSpeech.prototype.junwoo = function (text, outPath, cb) {
  this._voiceFn('JUNWOO', text, outPath, cb);
};
NeoSpeech.prototype.kate = function (text, outPath, cb) {
  this._voiceFn('KATE', text, outPath, cb);
};
NeoSpeech.prototype.liang = function (text, outPath, cb) {
  this._voiceFn('LIANG', text, outPath, cb);
};
NeoSpeech.prototype.misaki = function (text, outPath, cb) {
  this._voiceFn('MISAKI', text, outPath, cb);
};
NeoSpeech.prototype.paul = function (text, outPath, cb) {
  this._voiceFn('PAUL', text, outPath, cb);
};
NeoSpeech.prototype.show = function (text, outPath, cb) {
  this._voiceFn('SHOW', text, outPath, cb);
};
NeoSpeech.prototype.violeta = function (text, outPath, cb) {
  this._voiceFn('VIOLETA', text, outPath, cb);
};
NeoSpeech.prototype.yumi = function (text, outPath, cb) {
  this._voiceFn('YUMI', text, outPath, cb);
};

/**
 * Wrapper for _TTSRequestBuffer().
 *
 * Synthesizes the input text and outputs the resulting voice to buffer.
 * Using encryption method during communicating with server.
 */
NeoSpeech.prototype.requestBuffer = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    speakerId: 'JULIE',
    voiceFormat: 'DEFAULT',
    all: true
  });

  var first = true,
      sockfd = null;

  binding.TTSRequestBuffer({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()] || C.DB_NAMES.JULIE,
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()] || C.VOICE_FORMATS.DEFAULT,
    bFirst: (first ? 1 : 0),
    bAll: (params.all ? 1 : 0),
    sockfd: sockfd
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    var returnObj = {
      code: result.code,
      message: C.RETURN_CODES[result.code]
    };
    if (result.buffer) { returnObj.buffer = result.buffer; }
    if (result.sockfd) { returnObj.sockfd = result.sockfd; }
    return cb(null, returnObj);
  });
};

/**
 * Wrapper for _TTSRequestBufferEx().
 *
 * Synthesizes the input text and outputs the resulting voice to buffer.
 * Using encryption method during communicating with server.
 *
 * @param {Object} sockfd       Socket descriptor connected to VoiceText Server
 * @param {String} szServer     IP address of VoiceText Server
 * @param {Number} nPort        Port number used for sending synthesis requests to
 *                              and response from VoiceText Server. (default: 7000)
 * @param {String} pText Text   string to be synthesized
 * @param {Number} nTextLen     Length of pText
 * @param {Object} nVoiceLen    A pointer to an integer variable that holds the
 *                              length of the buffer frame returned from this function.
 *                              Note that the buffer length varies by synthesis output format.
 * @param {String} nSpeakerID   ID of the speaker’s voice (e.g. voice engine)
 *                              nSpeakerID must be set to the ID of a voice engine that is
 *                              installed on the system.
 * @param {Number} nVoiceFormat Output file format of synthesis.
 * @param {Number} nTextFormat  Format of the text to be synthesized.
 * @param {Number} nVolume      It sets the volume to be used in synthesis.
 *                              The effective range is from 0 to 500. (default: 100)
 *                              You can manually regulate the value around 100.
 *                              Over the max value will be recognized as max value(500),
 *                              below min value will be recognized as min value(0).
 *                              If nTextFormat is TEXT_SSML(1), this value will be ignored.
 * @param {Number} nSpeed       It sets the speed of the synthesized voice to be used in synthesis.
 *                              The effective range is from 50 to 400. (default: 100)
 *                              You can manually regulate the value around 100.
 *                              Over the max value will be recognized as max value(400), below min
 *                              value will be recognized as min value(50).
 *                              If nTextFormat is TEXT_SSML(1), this value will be ignored.
 * @param {Number} nPitch       It sets the pitch to be used in synthesis.
 *                              The effective range is from 50 to 200. (default: 100)
 *                              You can manually regulate the value around 100.
 *                              Over the max value will be recognized as max value(200), below min
 *                              value will be recognized as min value(50).
 *                              If nTextFormat is TEXT_SSML(1), this value will be ignored.
 * @param {Number} nDictNum     It sets the index numbers of the user-defined dictionary to be used
 *                              in synthesis. The effective range is from 0 to 100. (default: 0)
 *                              If nTextFormat is TEXT_SSML(1), this value will be ignored.
 * @param {Number} bFirst       Whether or not the first frame of the voice output is being requested.
 *                              true - Request of the first frame
 *                              false - Request after the first frame
 * @param {Number} bAll         Whether the resulting voice buffer is to be sent in one frame.
 *                              (vs. multiple frames)
 *                              true - To receive synthesis results in one frame buffer.
 *                              false - To receive synthesis results in multiple frame buffers
 * @param {Object} nReturn      Return value denoting the result status
 * @param {Object} szKey        Deciding encryption option. Please input NULL into szKey to
 *                              deactivate Encryption function.
 */
NeoSpeech.prototype.requestBufferEx = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    speakerId: 'JULIE',
    voiceFormat: 'DEFAULT',
    textFormat: 'NORMAL',
    volume: 100,  // 0-500
    speed: 100,   // 50-400
    pitch: 100,   // 50-200
    dictNum: 1,
    all: true
  });

  var first = true,
      sockfd = null;

  binding.TTSRequestBufferEx({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()] || C.DB_NAMES.JULIE,
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()] || C.VOICE_FORMATS.DEFAULT,
    nTextFormat: C.TEXT_FORMATS[params.textFormat.toUpperCase()] || C.TEXT_FORMATS.NORMAL,
    nVolume: params.volume,
    nSpeed: params.speed,
    nPitch: params.pitch,
    nDictIndex: params.dictNum,
    bFirst: (first ? 1 : 0),
    bAll: (params.all ? 1 : 0),
    sockfd: sockfd
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    var returnObj = {
      code: result.code,
      message: C.RETURN_CODES[result.code]
    };
    if (result.buffer) { returnObj.buffer = result.buffer; }
    if (result.sockfd) { returnObj.sockfd = result.sockfd; }
    return cb(null, returnObj);
  });
};

/**
 * Wrapper for _TTSRequestBufferSSMLEx().
 *
 * Synthesizes SSML formatted texts into voice buffer.
 * Using encryption method during communicating with server.
 */
NeoSpeech.prototype.requestBufferSSMLEx = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    speakerId: 'JULIE',
    voiceFormat: 'PCM',
    volume: 100,  // 0-500
    speed: 100,   // 50-400
    pitch: 100,   // 50-200
    dictNum: 1
  });

  var first = true,
      sockfd = null;

  binding.TTSRequestBufferSSMLEx({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()] || C.DB_NAMES.JULIE,
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()] || C.VOICE_FORMATS.DEFAULT,
    nVolume: params.volume,
    nSpeed: params.speed,
    nPitch: params.pitch,
    nDictIndex: params.dictNum,
    bFirst: (first ? 1 : 0),
    sockfd: sockfd
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    var returnObj = {
      code: result.code,
      message: C.RETURN_CODES[result.code],
      marks: result.marks
    };
    if (result.buffer) { returnObj.buffer = result.buffer; }
    if (result.sockfd) { returnObj.sockfd = result.sockfd; }
    return cb(null, returnObj);
  });
};

/**
 * Wrapper for TTSRequestFile().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFile = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    outPath: 'out',
    speakerId: 'JULIE',
    voiceFormat: 'DEFAULT'
  });

  binding.TTSRequestFile({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    szSaveDir: path.dirname(params.outPath),
    szSaveFile: path.basename(params.outPath),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()],
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()]
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    return cb(null, {
      code: result.code,
      message: C.RETURN_CODES[result.code]
    });
  });
};

/**
 * Wrapper for TTSRequestFileEx().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFileEx = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    outPath: 'out',
    speakerId: 'JULIE',
    voiceFormat: 'DEFAULT',
    textFormat: 'NORMAL',
    volume: 100,  // 0-500
    speed: 100,   // 50-400
    pitch: 100,   // 50-200
    dictNum: 1
  });

  binding.TTSRequestFileEx({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    szSaveDir: path.dirname(params.outPath),
    szSaveFile: path.basename(params.outPath),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()] || C.DB_NAMES.JULIE,
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()] || C.VOICE_FORMATS.DEFAULT,
    nTextFormat: C.TEXT_FORMATS[params.textFormat.toUpperCase()] || C.TEXT_FORMATS.NORMAL,
    nVolume: params.volume,
    nSpeed: params.speed,
    nPitch: params.pitch,
    nDictIndex: params.dictNum
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    return cb(null, {
      code: result.code,
      message: C.RETURN_CODES[result.code]
    });
  });
};

/**
 * Wrapper for TTSRequestFileSSML().
 *
 * Synthesizes the input SSML formatted text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFileSSML = function (params, cb) {
  params = _.isObject(params) ? params : {};
  cb = _.isFunction(cb) ? cb : cbDefault;

  _.defaults(params, {
    text: '',
    outPath: 'out',
    speakerId: 'JULIE',
    voiceFormat: 'DEFAULT'
  });

  binding.TTSRequestFileSSML({
    szServer: this._config.host,
    nPort: this._config.port,
    pText: params.text,
    nTextLen: Buffer.byteLength(params.text),
    szSaveDir: path.dirname(params.outPath),
    szSaveFile: path.basename(params.outPath),
    nSpeakerID: C.DB_NAMES[params.speakerId.toUpperCase()],
    nVoiceFormat: C.VOICE_FORMATS[params.voiceFormat.toUpperCase()]
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    return cb(null, {
      code: result.code,
      message: C.RETURN_CODES[result.code],
      marks: result.marks,
      voiceLen: result.voiceLen
    });
  });
};

/**
 * Wrapper for TTSRequestStatus().
 *
 * Requests the status of VoiceText Server.
 *
 * @param {String} ip   IP address of VoiceText Server
 * @param {Number} port Port number used for sending status requests to and
 *                      response from VoiceText Server.
 */
NeoSpeech.prototype.requestStatus = function (cb) {
  cb = _.isFunction(cb) ? cb : cbDefault;

  binding.TTSRequestStatus({
    szServer: this._config.host,
    nPort: this._config.port
  }, function (result) {
    if (result.code < 0) {
      return cb(C.RETURN_CODES[result.code]);
    }
    return cb(null, {
      code: result.code,
      message: (result.code === 0 || result.code === 1 || result.code === 2 ?
                C.SERVER_STATUS[result.code] : C.RETURN_CODES[result.code])
    });
  });
};

// Public API
exports = module.exports = NeoSpeech;
