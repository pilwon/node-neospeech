/*
 * lib/index.js
 */

'use strict';

var path = require('path');

var C = require('./constants'),
    binding = require('../build/Release/neospeech');

/**
 * Wrapper for _TTSRequestBuffer().
 *
 * Synthesizes the input text and outputs the resulting voice to buffer.
 * Using encryption method during communicating with server.
 */
function requestBuffer(host, port, text, speakerId, voiceFormat, first, all, sockfd) {
  var textSize = Buffer.byteLength(text),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat];

  var result;
  if (sockfd) {
    result = binding._TTSRequestBuffer(host, port, text, textSize, speakerCode,
                                       voiceFormatCode, first, all, sockfd);
  } else {
    result = binding._TTSRequestBuffer(host, port, text, textSize, speakerCode,
                                       voiceFormatCode, first, all);
  }

  var returnObj = {
    'code': result.code,
    'message': C.RETURN_CODES[result.code]
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return returnObj;
}

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
function requestBufferEx(host, port, text, speakerId, voiceFormat, textFormat,
                         volume, speed, pitch, dictNum, first, all, sockfd) {
  var textSize = Buffer.byteLength(text),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat];//,
      // textFormatCode = C.TEXT_FORMATS[textFormat];

  var result;
  if (sockfd) {
    result = binding._TTSRequestBufferEx(host, port, text, textSize, speakerCode,
                                         voiceFormatCode, textFormat, volume, speed,
                                         pitch, dictNum, first, all, sockfd);
  } else {
    result = binding._TTSRequestBufferEx(host, port, text, textSize, speakerCode,
                                         voiceFormatCode, textFormat, volume, speed,
                                         pitch, dictNum, first, all);
  }

  var returnObj = {
    'code': result.code,
    'message': C.RETURN_CODES[result.code]
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return returnObj;
}

/**
 * Wrapper for _TTSRequestBufferSSMLEx().
 *
 * Synthesizes SSML formatted texts into voice buffer.
 * Using encryption method during communicating with server.
 */
function requestBufferSSMLEx(host, port, text, speakerId, voiceFormat,
                             volume, speed, pitch, dictNum, first, sockfd) {
  var textSize = Buffer.byteLength(text),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat];

  var result;
  if (sockfd) {
    result = binding._TTSRequestBufferSSMLEx(host, port, text, textSize, speakerCode,
                                             voiceFormatCode, volume, speed, pitch,
                                             dictNum, first, sockfd);
  } else {
    result = binding._TTSRequestBufferSSMLEx(host, port, text, textSize, speakerCode,
                                             voiceFormatCode, volume, speed, pitch,
                                             dictNum, first);
  }

  var returnObj = {
    'code': result.code,
    'message': C.RETURN_CODES[result.code],
    'marks': result.marks
  };

  if (result.buffer) { returnObj.buffer = result.buffer; }
  if (result.sockfd) { returnObj.sockfd = result.sockfd; }

  return returnObj;
}

/**
 * Wrapper for TTSRequestFile().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
function requestFile(host, port, text, outPath, speakerId, voiceFormat) {
  var textSize = Buffer.byteLength(text),
      outPathDir = path.dirname(outPath),
      outPathFile = path.basename(outPath),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat];

  var result = binding.TTSRequestFile(host, port, text, textSize, outPathDir, outPathFile,
                                      speakerCode, voiceFormatCode);
  return {
    'code': result,
    'message': C.RETURN_CODES[result]
  };
}

/**
 * Wrapper for TTSRequestFileEx().
 *
 * Synthesizes the input text and outputs the resulting voice to a file.
 */
function requestFileEx(host, port, text, outPath, speakerId, voiceFormat,
                       textFormat, volume, speed, pitch, dictNum) {
  var textSize = Buffer.byteLength(text),
      outPathDir = path.dirname(outPath),
      outPathFile = path.basename(outPath),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat],
      textFormatCode = C.TEXT_FORMATS[textFormat];

  var result = binding.TTSRequestFileEx(host, port, text, textSize, outPathDir, outPathFile,
                                        speakerCode, voiceFormatCode, textFormatCode, volume,
                                        speed, pitch, dictNum);

  return {
    'code': result,
    'message': C.RETURN_CODES[result]
  };
}

/**
 * Wrapper for TTSRequestFileSSML().
 *
 * Synthesizes the input SSML formatted text and outputs the resulting voice to a file.
 */
function requestFileSSML(host, port, text, outPath, speakerId, voiceFormat) {
  var textSize = Buffer.byteLength(text),
      outPathDir = path.dirname(outPath),
      outPathFile = path.basename(outPath),
      speakerCode = C.DB_NAMES[speakerId],
      voiceFormatCode = C.VOICE_FORMATS[voiceFormat];

  var result = binding.TTSRequestFileSSML(host, port, text, textSize, outPathDir, outPathFile,
                                          speakerCode, voiceFormatCode);
  return {
    'code': result.code,
    'message': C.RETURN_CODES[result.code],
    'marks': result.marks,
    'voiceLen': result.voiceLen
  };
}

/**
 * Wrapper for TTSRequestStatus().
 *
 * Requests the status of VoiceText Server.
 *
 * @param {String} ip   IP address of VoiceText Server
 * @param {Number} port Port number used for sending status requests to and
 *                      response from VoiceText Server. (default: 7777)
 */
function requestStatus(host, port) {
  var result = binding.TTSRequestStatus(host, port || 7777);
  var message = (result === 0 || result === 1 || result === 2 ?
                 C.SERVER_STATUS[result] : C.RETURN_CODES[result]);
  return {
    'code': result,
    'message': message
  };
}

/**
 * Creates a convenience function.
 */
function voiceFn(speakerCode) {
  return function (text, outPath) {
    if (!outDir) { outDir = 'out'; }
    return requestFileSSML('127.0.0.1', 7000, text, outPath, speakerCode, 'WAV');
  };
}

// Public API
exports.requestBuffer = requestBuffer;
exports.requestBufferEx = requestBufferEx;
exports.requestBufferSSMLEx = requestBufferSSMLEx;
exports.requestFile = requestFile;
exports.requestFileEx = requestFileEx;
exports.requestFileSSML = requestFileSSML;
exports.requestStatus = requestStatus;

// Convenience functions
exports.bridget = voiceFn('BRIDGET');
exports.hui = voiceFn('HUI');
exports.julie = voiceFn('JULIE');
exports.junwoo = voiceFn('JUNWOO');
exports.kate = voiceFn('KATE');
exports.liang = voiceFn('LIANG');
exports.misaki = voiceFn('MISAKI');
exports.paul = voiceFn('PAUL');
exports.show = voiceFn('SHOW');
exports.violeta = voiceFn('VIOLETA');
exports.yumi = voiceFn('YUMI');
