/*
 * lib/index.js
 */

'use strict';

var path = require('path');

var _ = require('lodash');

var C = require('./constants'),
    binding = require('../build/Release/neospeech');

var NeoSpeech = function (config) {
  this._config = _.isObject(config) ? config : {};

  _.defaults(this._config, {
    host: '127.0.0.1',
    port: 7000
  });
};

/**
 * Convenience function.
 */
NeoSpeech.prototype._voiceFn = function (speakerCode, text, outPath, cb) {
  this.requestFileSSML({
    text: text,
    outPath: outPath || 'out',
    speakerId: speakerCode,
    voiceFormat: 'WAV'
  }, cb);
};

/**
 * Wrapper for _TTSRequestBuffer().
 *
 * Synthesizes the input text and outputs the resulting voice to buffer.
 * Using encryption method during communicating with server.
 */
NeoSpeech.prototype.requestBuffer = function (params, cb) {
  _.defaults(params, {
    text: null,
    speakerId: null,
    voiceFormat: null,
    first: null,
    all: null,
    sockfd: null
  });

  var textSize = Buffer.byteLength(params.text),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      result,
      returnObj;

  if (params.sockfd) {
    result = binding._TTSRequestBuffer(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      params.first,
      params.all,
      params.sockfd
    );
  } else {
    result = binding._TTSRequestBuffer(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      params.first,
      params.all);
  }

  returnObj = {
    code: result.code,
    message: C.RETURN_CODES[result.code]
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return cb(null, returnObj);
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
  _.defaults(params, {
    text: null,
    speakerId: null,
    voiceFormat: null,
    textFormat: null,
    volume: null,
    speed: null,
    pitch: null,
    dictNum: null,
    first: null,
    all: null,
    sockfd: null
  });

  var textSize = Buffer.byteLength(params.text),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      // textFormatCode = C.TEXT_FORMATS[params.textFormat],
      result,
      returnObj;

  if (params.sockfd) {
    result = binding._TTSRequestBufferEx(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      // textFormatCode,
      params.textFormat,
      params.volume,
      params.speed,
      params.pitch,
      params.dictNum,
      params.first,
      params.all,
      params.sockfd);
  } else {
    result = binding._TTSRequestBufferEx(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      // textFormatCode,
      params.textFormat,
      params.volume,
      params.speed,
      params.pitch,
      params.dictNum,
      params.first,
      params.all);
  }

  returnObj = {
    code: result.code,
    message: C.RETURN_CODES[result.code]
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return cb(null, returnObj);
};

/**
 * Wrapper for _TTSRequestBufferSSMLEx().
 *
 * Synthesizes SSML formatted texts into voice buffer.
 * Using encryption method during communicating with server.
 */
NeoSpeech.prototype.requestBufferSSMLEx = function (params, cb) {
  _.defaults(params, {
    text: null,
    speakerId: null,
    voiceFormat: null,
    volume: null,
    speed: null,
    pitch: null,
    dictNum: null,
    first: null,
    sockfd: null
  });

  var textSize = Buffer.byteLength(params.text),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      result,
      returnObj;

  if (params.sockfd) {
    result = binding._TTSRequestBufferSSMLEx(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      params.volume,
      params.speed,
      params.pitch,
      params.dictNum,
      params.first,
      params.sockfd);
  } else {
    result = binding._TTSRequestBufferSSMLEx(
      this._config.host,
      this._config.port,
      params.text,
      textSize,
      speakerCode,
      voiceFormatCode,
      params.volume,
      params.speed,
      params.pitch,
      params.dictNum,
      params.first);
  }

  returnObj = {
    code: result.code,
    message: C.RETURN_CODES[result.code],
    marks: result.marks
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return cb(null, returnObj);
};

/**
 * Wrapper for TTSRequestFile().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFile = function (params, cb) {
  _.defaults(params, {
    text: null,
    outPath: null,
    speakerId: null,
    voiceFormat: null
  });

  var textSize = Buffer.byteLength(params.text),
      outPathDir = path.dirname(params.outPath),
      outPathFile = path.basename(params.outPath),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      result;

  result = binding.TTSRequestFile(
    this._config.host,
    this._config.port,
    params.text,
    textSize,
    outPathDir,
    outPathFile,
    speakerCode,
    voiceFormatCode
  );

  return cb(null, {
    code: result,
    message: C.RETURN_CODES[result]
  });
};

/**
 * Wrapper for TTSRequestFileEx().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFileEx = function (params, cb) {
  _.defaults(params, {
    text: null,
    outPath: null,
    speakerId: null,
    voiceFormat: null,
    textFormat: null,
    volume: null,
    speed: null,
    pitch: null,
    dictNum: null
  });

  var textSize = Buffer.byteLength(params.text),
      outPathDir = path.dirname(params.outPath),
      outPathFile = path.basename(params.outPath),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      textFormatCode = C.TEXT_FORMATS[params.textFormat],
      result;

  result = binding.TTSRequestFileEx(
    this._config.host,
    this._config.port,
    params.text,
    textSize,
    outPathDir,
    outPathFile,
    speakerCode,
    voiceFormatCode,
    textFormatCode,
    params.volume,
    params.speed,
    params.pitch,
    params.dictNum
  );

  return cb(null, {
    code: result,
    message: C.RETURN_CODES[result]
  });
};

/**
 * Wrapper for TTSRequestFileSSML().
 *
 * Synthesizes the input SSML formatted text and outputs the resulting voice to a file.
 */
NeoSpeech.prototype.requestFileSSML = function (params, cb) {
  _.defaults(params, {
    text: null,
    outPath: null,
    speakerId: null,
    voiceFormat: null
  });

  var textSize = Buffer.byteLength(params.text),
      outPathDir = path.dirname(params.outPath),
      outPathFile = path.basename(params.outPath),
      speakerCode = C.DB_NAMES[params.speakerId],
      voiceFormatCode = C.VOICE_FORMATS[params.voiceFormat],
      result;

  result = binding.TTSRequestFileSSML(
    this._config.host,
    this._config.port,
    params.text,
    textSize,
    outPathDir,
    outPathFile,
    speakerCode,
    voiceFormatCode
  );

  return cb(null, {
    code: result.code,
    message: C.RETURN_CODES[result.code],
    marks: result.marks,
    voiceLen: result.voiceLen
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
  var result = binding.TTSRequestStatus(this._config.host, this._config.port);

  var message = (result === 0 || result === 1 || result === 2 ?
                 C.SERVER_STATUS[result] : C.RETURN_CODES[result]);

  return cb(null, {
    code: result,
    message: message
  });
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

// Public API
exports = module.exports = NeoSpeech;
