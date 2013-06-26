/*
 * examples/neospeech.js
 */

require('colors');

var fs = require('fs');

var neospeech = new (require('..'))();

neospeech.julie('Hello, my name is Julie.', 'test-julie', function (err, result) {
  console.log('=== julie (test-julie.wav) ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});

neospeech.bridget('Hello, my name is Bridget.', 'test-bridget', function (err, result) {
  console.log('=== bridget (test-bridget.wav) ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});

neospeech.requestBuffer({
  text: 'The audio data written to buffer memory was saved to a file on disk.',
  voiceFormat: 'PCM',
  all: true
}, function (err, result) {
  console.log('=== requestBuffer (test-requestBuffer.pcm) ==='.cyan);
  if (err) { return console.error(err); }

  var fout = fs.createWriteStream('/usr/vt/result/test-requestBuffer.pcm', {flags: 'w'});
  fout.on('error', function (err) {
    console.error(err);
  });
  fout.write(result.buffer);
  fout.end();
  fout.destroy();

  console.log(result);

  neospeech.util.m4a('/usr/vt/result/test-requestBuffer.pcm');
  neospeech.util.mp3('/usr/vt/result/test-requestBuffer.pcm');
  neospeech.util.ogg('/usr/vt/result/test-requestBuffer.pcm');
  neospeech.util.wav('/usr/vt/result/test-requestBuffer.pcm');
});

neospeech.requestBufferEx({
  text: 'I have a very annoying voice.',
  voiceFormat: 'BRIDGET',
  volume: 400,  // 0-500
  speed: 70,    // 50-400
  pitch: 200,   // 50-200
  all: true
}, function (err, result) {
  console.log('=== requestBufferEx (test-requestBufferEx.wav) ==='.cyan);
  if (err) { return console.error(err); }

  var fout = fs.createWriteStream('/usr/vt/result/test-requestBufferEx.wav', {flags: 'w'});
  fout.on('error', function (err) {
    console.error(err);
  });
  fout.write(result.buffer);
  fout.end();
  fout.destroy();

  console.log(result);
});

neospeech.requestBufferSSMLEx({
  text: 'SSML is an advanced way to create audio files.'
}, function (err, result) {
  console.log('=== requestBufferSSMLEx (test-requestBufferSSMLEx.pcm) ==='.cyan);
  if (err) { return console.error(err); }

  var fout = fs.createWriteStream('/usr/vt/result/test-requestBufferSSMLEx.pcm', {flags: 'w'});
  fout.on('error', function (err) {
    console.error(err);
  });
  fout.write(result.buffer);
  fout.end();
  fout.destroy();

  console.log(result);
});

neospeech.requestFile({
  text: 'Bridget is U.K. English Female voice.',
  outPath: 'test-requestFile',
  speakerId: 'BRIDGET'
}, function (err, result) {
  console.log('=== requestFile (test-requestFile.wav) ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});

neospeech.requestFileEx({
  text: 'I can speak fast or slow, loudly or quietly, and with high pitch or low pitch.',
  outPath: 'test-requestFileEx',
  textFormat: 'TEXT',
  volume: 200,  // 0-500
  speed: 120,   // 50-400
  pitch: 80     // 50-200
}, function (err, result) {
  console.log('=== requestFileEx (TEXT, test-requestFileEx.wav) ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});

neospeech.requestFileSSML({
  text: '<mark name="mark1"/> Hello, this <mark name="mark2"/> is a test <mark name="mark3"/> with the marks. <mark name="mark4"/>',
  outPath: 'test-requestFileSSML'
}, function (err, result) {
  console.log('=== requestFileSSML (test-requestFileSSML.wav) ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});

neospeech.requestStatus(function (err, result) {
  console.log('=== requestStatus ==='.cyan);
  if (err) { return console.error(err); }
  console.log(JSON.stringify(result, null, 2));
});
