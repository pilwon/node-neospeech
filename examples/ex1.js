/*
 * examples/ex1.js
 */

'use strict';

var exec = require('child_process').exec;

var neospeech = require('..');

function puts(error, stdout, stderr) {
  console.log({
    error: error,
    stdout: stdout,
    stderr: stderr
  });
}

console.log(neospeech.requestFile('localhost', 7000,
                                  'Hello, my name is Julie.',
                                  'test/Julie',
                                  'JULIE', 'WAV'));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Julie.wav /usr/vt/result/test/Julie.mp3', puts);
exec('oggenc /usr/vt/result/test/Julie.wav -o /usr/vt/result/test/Julie.ogg', puts);

console.log(neospeech.requestFile('localhost', 7000,
                                  'Hello, my name is Bridget.',
                                  'test/Bridget',
                                  'BRIDGET', 'WAV'));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Bridget.wav /usr/vt/result/test/Bridget.mp3', puts);
exec('oggenc /usr/vt/result/test/Bridget.wav -o /usr/vt/result/test/Bridget.ogg', puts);

console.log(neospeech.requestFileSSML('localhost', 7000,
                                      '<mark name="start"/>嗨，我的名字是回族。<mark name="end"/>',
                                      'test/Hui',
                                      'HUI', 'WAV'));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Hui.wav /usr/vt/result/test/Hui.mp3', puts);
exec('oggenc /usr/vt/result/test/Hui.wav -o /usr/vt/result/test/Hui.ogg', puts);

console.log(neospeech.requestFileSSML('localhost', 7000,
                                      '<mark name="start"/>こんにちは、私は岬です。<mark name="end"/>',
                                      'test/Misaki',
                                      'MISAKI', 'WAV'));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Misaki.wav /usr/vt/result/test/Misaki.mp3', puts);
exec('oggenc /usr/vt/result/test/Misaki.wav -o /usr/vt/result/test/Misaki.ogg', puts);

console.log(neospeech.requestFileEx('localhost', 7000,
                                    '안녕하세요, 저는 유미입니다.',
                                    'test/Yumi',
                                    'YUMI', 'WAV', 'SSML',
                                    100, 100, 100, 0));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Yumi.wav /usr/vt/result/test/Yumi.mp3', puts);
exec('oggenc /usr/vt/result/test/Yumi.wav -o /usr/vt/result/test/Yumi.ogg', puts);

console.log(neospeech.requestFileEx('localhost', 7000,
                                    'Hello, my name is Paul.',
                                    'test/Paul',
                                    'PAUL', 'WAV', 'NORMAL',
                                    100, 100, 100, 0));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Paul.wav /usr/vt/result/test/Paul.mp3', puts);
exec('oggenc /usr/vt/result/test/Paul.wav -o /usr/vt/result/test/Paul.ogg', puts);

console.log(neospeech.requestFileEx('localhost', 7000,
                                    'Hola, mi nombre es Violeta.',
                                    'test/Violeta',
                                    'VIOLETA', 'WAV', 'NORMAL',
                                    100, 100, 100, 0));
exec('lame -V0 -h -b 160 --vbr-new /usr/vt/result/test/Violeta.wav /usr/vt/result/test/Violeta.mp3', puts);
exec('oggenc /usr/vt/result/test/Violeta.wav -o /usr/vt/result/test/Violeta.ogg', puts);

process.exit(0);  // Volume 0-500, Speed 50-400, Pitch 50-200
console.log(neospeech.requestBuffer('localhost', 7000,
                                    'Hello.I-am-voicewares-yumi.',
                                    'YUMI', 'WAV', true, true));

console.log(neospeech.requestBufferEx('localhost', 7000,
                                      'Hello.I-am-voicewares-yumi.',
                                      'YUMI', 'WAV', 'NORMAL',
                                      100, 100, 100, 0, true, true));

console.log(neospeech.requestBufferSSMLEx('localhost', 7000,
                                          'Hello.I-am-voicewares-yumi.',
                                          'YUMI', 'WAV',
                                          100, 100, 100, 0, true, true));

console.log(neospeech.requestStatus('localhost', 7000));
