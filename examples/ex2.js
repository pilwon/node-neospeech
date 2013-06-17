/*
 * examples/ex2.js
 */

'use strict';

var fs = require('fs'),
    exec = require('child_process').exec;

var neospeech = require('..'),
    len = 0,
    marks = [],
    result;

var voice = 'YUMI',
    text = '안녕하세요, 저는 유미라고 합니다. <voice name="bridget">Hi Yumi, this is Bridget.</voice> <voice name="paul">Hey my ladies, how\'s everything going?</voice> Hahaha!';

var fout = fs.createWriteStream('/usr/vt/result/test.pcm', {flags: 'w'});

fout.on('error', function (error) {
  console.log(error);
});

result = neospeech.requestBufferSSMLEx('127.0.0.1', 7000, text, voice, 'PCM', 100, 100, 100, 0, true);
if (result.buffer) {
  fout.write(result.buffer);
  len += result.buffer.length;
  marks.push.apply(marks, result.marks);
} else {
  console.log(result);
}

while (result.sockfd) {
  result = neospeech.requestBufferSSMLEx('127.0.0.1', 7000, text, voice, 'PCM', 100, 100, 100, 0, false, result.sockfd);
  fout.write(result.buffer);
  len += result.buffer.length;
  marks.push.apply(marks, result.marks);
}

fout.end();
fout.destroy();

console.log({
  code: result.code,
  message: result.message,
  marks: marks,
  len: len
});

exec('ffmpeg -f s16le -ar 16000 -i /usr/vt/result/test.pcm -y -f wav /usr/vt/result/test.wav');
exec('ffmpeg -f s16le -ar 16000 -i /usr/vt/result/test.pcm -y -ab 160k /usr/vt/result/test.mp3');
exec('ffmpeg -f s16le -ar 16000 -i /usr/vt/result/test.pcm -y /usr/vt/result/test.ogg');
exec('ffmpeg -f s16le -ar 16000 -i /usr/vt/result/test.pcm -y -ar 32000 -ab 160k /usr/vt/result/test.m4a');
