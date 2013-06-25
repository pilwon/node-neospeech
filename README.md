# NeoSpeech

`neospeech` is a client library for [NeoSpeech TTS](http://neospeech.com/) written in [Node.js](http://nodejs.org/).

## Installation

    $ npm install neospeech

## Usage

```js
var neospeech = new (require('neospeech'))({
  // host: '127.0.0.1',
  // port: 7000
});
```

### API

#### Convenience Functions

```js
neospeech.bridget(text, outPath, function (err, result) {});
neospeech.hui(text, outPath, function (err, result) {});
neospeech.julie(text, outPath, function (err, result) {});
neospeech.junwoo(text, outPath, function (err, result) {});
neospeech.kate(text, outPath, function (err, result) {});
neospeech.liang(text, outPath, function (err, result) {});
neospeech.misaki(text, outPath, function (err, result) {});
neospeech.paul(text, outPath, function (err, result) {});
neospeech.show(text, outPath, function (err, result) {});
neospeech.violeta(text, outPath, function (err, result) {});
neospeech.yumi(text, outPath, function (err, result) {});
```

#### Request Buffer

```js
neospeech.requestBuffer({
  text: TEXT,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT,
  first: FIRST,
  all: ALL,
  sockfd: SOCKFD
}, function (err, result) {
  // result.code
  // result.message
  // result.buffer
  // result.sockfd
});
```

#### Request Buffer Ex

```js
neospeech.requestBufferEx({
  text: TEXT,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT,
  textFormat: TEXT_FORMAT,
  volume: VOLUME,
  speed: SPEED,
  pitch: PITCH,
  dictNum: DICT_NUM,
  first: FIRST,
  all: ALL,
  sockfd: SOCKFD
}, function (err, result) {
  // result.code
  // result.message
  // result.buffer
  // result.sockfd
});
```

#### Request Buffer SSML Ex

```js
neospeech.requestBufferSSMLEx({
  text: TEXT,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT,
  volume: VOLUME,
  speed: SPEED,
  pitch: PITCH,
  dictNum: DICT_NUM,
  first: FIRST,
  sockfd: SOCKFD
}, function (err, result) {
  // result.code
  // result.message
  // result.marks
  // result.buffer
  // result.sockfd
});
```

#### Request File

```js
neospeech.requestFile({
  text: TEXT,
  outPath: OUT_PATH,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT
}, function (err, result) {
  // result.code
  // result.message
});
```

#### Request File Ex

```js
neospeech.requestFileEx({
  text: TEXT,
  outPath: OUT_PATH,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT,
  textFormat: TEXT_FORMAT,
  volume: VOLUME,
  speed: SPEED,
  pitch: PITCH,
  dictNum: DICT_NUM
}, function (err, result) {
  // result.code
  // result.message
});
```

#### Request File SSML

```js
neospeech.requestFileSSML({
  text: TEXT,
  outPath: OUT_PATH,
  speakerId: SPEAKER_ID,
  voiceFormat: VOICE_FORMAT
}, function (err, result) {
  // result.code
  // result.message
  // result.marks
  // result.voiceLen
});
```

#### Request Status

```js
neospeech.requestStatus(function (err, result) {
  // result.code
  // result.message
});
```

## Development

### Dependencies

The following library dependencies are only required for running the example code.

    $ aptitude install ffmpeg libavcodec-extra-52
    $ aptitude install lame vorbis-tools
    $ aptitude install libmp3lame-dev libmpg123-dev

### Building binding

    $ node-gyp configure
    $ node-gyp install

## Credits

  See the [contributors](https://github.com/pilwon/node-neospeech/graphs/contributors).

## License

  `neospeech` is released under the [MIT License](http://opensource.org/licenses/MIT).
