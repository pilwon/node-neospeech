/*
 * lib/constants.js
 */

'use strict';

exports.DEBUG = false;

exports.__VTAP_VER__ = '3.10.6.0';

exports.RETURN_CODES = {
  '0': 'Result Continue (code = 0)',
  '1': 'Result Success (code = 1)',
  '-1': 'Hostname Error (code = -1)',
  '-2': 'Socket Error (code = -2)',
  '-3': 'Connect Error (code = -3)',
  '-4': 'Read/Write Error (code = -4)',
  '-5': 'Memory Error (code = -5)',
  '-6': 'Text Error (code = -6)',
  '-7': 'Voice Format Error (code = -7)',
  '-8': 'Param Error (code = -8)',
  '-9': 'Result Error (code = -9)',
  '-10': 'Speaker Error (code = -10)',
  '-11': 'Disk Error (code = -11)',
  '-12': 'Unknown Error (code = -12)',
  '-13': 'SSML Error (code = -13)',
  '-14': 'ENC Error (code = -14)',
  '-15': 'Abnormal Error (code = -15)',
  '-100': 'Max Error (code = -100)'
};

exports.DB_NAMES = {
  'JIHAE': 0,
  'MINHO': 1,
  'EUNJU': 2,
  'JUNWOO': 3,     // Korean, Male
  'NAYEON': 4,
  'SUNYOUNG': 6,
  'SUJIN': 8,      // Korean, Female
  'YUMI': 10,      // Korean, Female
  'GYURI': 11,     // Korean, Female
  'DAYOUNG': 12,   // Korean, Female
  'CHORONG': 13,   // Korean, Female
  'HYERYUN': 14,   // Korean, Female
  'HYUNA': 15,     // Korean, Female
  'KATE': 100,     // English, Female
  'PAUL': 101,     // English, Male
  'JULIE': 103,    // English, Female
  'JAMES': 104,    // English, Male
  'LILY': 200,     // Chinese, Female
  'WANG': 201,     // Chinese, Male
  'HUI': 202,      // Chinese, Female
  'LIANG': 203,    // Chinese, Male
  'MIYU': 300,     // Japanese, Female
  'SHOW': 301,     // Japanese, Male
  'MISAKI': 302,   // Japanese, Female
  'HARUKA': 303,   // Japanese, Female
  'SAYAKA': 304,   // Japanese, Female
  'RYO': 305,      // Japanese, Male
  'HIKARI': 306,   // Japanese, Female
  'VIOLETA': 400,  // Spanish, Female
  'BRIDGET': 500,  // British, Female
  'CHLOE': 600     // Canadian-French, Female
};

exports.VOICE_FORMATS = {
  'DEFAULT': 0,       // Default
  'WAV': 1,           // 16bit linear PCM Wave
  'PCM': 2,           // 16bit linear PCM
  'MULAW': 3,         // 8bit Mu-law PCM
  'ALAW': 4,          // 8bit A-law PCM
  'ADPCM': 5,         // 4bit Dialogic ADPCM
  'ASF': 6,           // Windows ASF
  'WMA': 7,
  '32ADPCM': 8,
  'MP3': 9,
  'OGG': 10,          // Ogg Vorbis
  '8BITWAV': 11,      // 8bit unsigned linear PCM Wave
  'AWAV': 12,         // 8bit A-law PCM Wave
  'MUWAV': 13,        // 8bit Mu-law PCM Wave
  'ADWAV': 14,
  'G726': 15,
  '8BITPCM': 16,
  'OUTPROC': 17,      // User defined Format
  'OUTPROC_SYNC': 18  // Text Sink Value
};

exports.TEXT_FORMATS = {
  'NORMAL': 0,  // Normal Text
  'SSML': 1,    // SSML Text
  'HTML': 2,
  'EMAIL': 3,
  'JEITA': 4,
  '7BIT': 5
};

exports.SERVER_STATUS = {
  0: 'Off',
  1: 'On',
  2: 'Paused'
};
