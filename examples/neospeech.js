/*
 * examples/neospeech.js
 */

require('colors');

var neospeech = new (require('..'))();

neospeech.julie('test test test', 'test', function (err, result) {
  if (err) { return console.error(err); }
  console.log('=== Julie ==='.cyan);
  console.log(result);
});
