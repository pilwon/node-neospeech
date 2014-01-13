# NeoSpeech

`neospeech` is a client library for [NeoSpeech TTS](http://neospeech.com/) written in [Node.js](http://nodejs.org/).

## Dependencies

- `ffmpeg`
- `libmp3lame` for mp3
- `libvorbis` for ogg

Refer to [Installing FFmpeg](#installing-ffmpeg) section for more details.

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
neospeech.bridget(TEXT, OUT_PATH, function (err, result) {});
neospeech.hui(TEXT, OUT_PATH, function (err, result) {});
neospeech.julie(TEXT, OUT_PATH, function (err, result) {});
neospeech.junwoo(TEXT, OUT_PATH, function (err, result) {});
neospeech.kate(TEXT, OUT_PATH, function (err, result) {});
neospeech.liang(TEXT, OUT_PATH, function (err, result) {});
neospeech.misaki(TEXT, OUT_PATH, function (err, result) {});
neospeech.paul(TEXT, OUT_PATH, function (err, result) {});
neospeech.show(TEXT, OUT_PATH, function (err, result) {});
neospeech.violeta(TEXT, OUT_PATH, function (err, result) {});
neospeech.yumi(TEXT, OUT_PATH, function (err, result) {});
```

#### Request Buffer

```js
neospeech.requestBuffer({
  text: TEXT,                 // default: ''
  speakerId: SPEAKER_ID,      // default: 'JULIE'
  voiceFormat: VOICE_FORMAT,  // default: 'DEFAULT'
  all: ALL                    // default: true, required: voiceFormat='PCM','MULAW','ALAW'
}, function (err, result) {
  // result.code
  // result.message
  // result.buffer (if value exists)
  // result.sockfd (if value exists)
});
```

#### Request Buffer Ex

```js
neospeech.requestBufferEx({
  text: TEXT,                 // default: ''
  speakerId: SPEAKER_ID,      // default: 'JULIE'
  voiceFormat: VOICE_FORMAT,  // default: 'DEFAULT'
  textFormat: TEXT_FORMAT,    // default: 'NORMAL'
  volume: VOLUME,             // default: 100, valid: 0-500
  speed: SPEED,               // default: 100, valid: 50-400
  pitch: PITCH,               // default: 100, valid: 50-200
  dictNum: DICT_NUM,          // default: 1
  all: ALL                    // default: true, required: voiceFormat='PCM','MULAW','ALAW'
}, function (err, result) {
  // result.code
  // result.message
  // result.buffer (if value exists)
  // result.sockfd (if value exists)
});
```

#### Request Buffer SSML Ex

```js
neospeech.requestBufferSSMLEx({
  text: TEXT,                 // default: ''
  speakerId: SPEAKER_ID,      // default: 'JULIE'
  voiceFormat: VOICE_FORMAT,  // default: 'PCM', valid: 'PCM','MULAW','ALAW'
  volume: VOLUME,             // default: 100, valid: 0-500
  speed: SPEED,               // default: 100, valid: 50-400
  pitch: PITCH,               // default: 100, valid: 50-200
  dictNum: DICT_NUM           // default: 1
}, function (err, result) {
  // result.code
  // result.message
  // result.marks
  // result.buffer (if value exists)
  // result.sockfd (if value exists)
});
```

#### Request File

```js
neospeech.requestFile({
  text: TEXT,                // default: ''
  outPath: OUT_PATH,         // default: 'out'
  speakerId: SPEAKER_ID,     // default: 'JULIE'
  voiceFormat: VOICE_FORMAT  // default: 'DEFAULT'
}, function (err, result) {
  // result.code
  // result.message
});
```

#### Request File Ex

```js
neospeech.requestFileEx({
  text: TEXT,                 // default: ''
  outPath: OUT_PATH,          // default: 'out'
  speakerId: SPEAKER_ID,      // default: 'JULIE'
  voiceFormat: VOICE_FORMAT,  // default: 'DEFAULT'
  textFormat: TEXT_FORMAT,    // default: 'NORMAL'
  volume: VOLUME,             // default: 100, valid: 0-500
  speed: SPEED,               // default: 100, valid: 50-400
  pitch: PITCH,               // default: 100, valid: 50-200
  dictNum: DICT_NUM           // default: 1
}, function (err, result) {
  // result.code
  // result.message
});
```

#### Request File SSML

```js
neospeech.requestFileSSML({
  text: TEXT,                // default: ''
  outPath: OUT_PATH,         // default: 'out'
  speakerId: SPEAKER_ID,     // default: 'JULIE'
  voiceFormat: VOICE_FORMAT  // default: 'DEFAULT'
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

### Compiling C++ Binding

    $ node-gyp configure && node-gyp build

### Installing [FFmpeg](http://www.ffmpeg.org/)

#### Ubuntu

    $ apt-get install ffmpeg libavcodec-extra-52
    $ apt-get install lame vorbis-tools
    $ apt-get install libmp3lame-dev libmpg123-dev

#### Amazon Linux / Cent OS

- [Compiling FFmpeg on Amazon Linux](http://ffmpeg.org/trac/ffmpeg/wiki/CentosCompilationGuide)
- [Installing ffmpeg on Amazon Linux 2013.03](http://www.chipnick.com/blog/2013/04/08/installing-ffmpeg-on-amazon-linux-2013-03/)

```sh
yum install autoconf automake gcc gcc-c++ git libtool make nasm pkgconfig zlib-devel
mkdir ~/ffmpeg_src

# yasm
yum install yasm

# libfdk_aac
cd ~/ffmpeg_src
git clone --depth 1 git://github.com/mstorsjo/fdk-aac.git
cd fdk-aac
autoreconf -fiv
./configure --disable-shared
make
make install
make distclean

# libmp3lame
cd ~/ffmpeg_src
curl -L -O http://downloads.sourceforge.net/project/lame/lame/3.99/lame-3.99.5.tar.gz
tar xzvf lame-3.99.5.tar.gz
cd lame-3.99.5
./configure --disable-shared --enable-nasm
make
make install
make distclean

# libogg
cd ~/ffmpeg_src
curl -O http://downloads.xiph.org/releases/ogg/libogg-1.3.1.tar.gz
tar xzvf libogg-1.3.1.tar.gz
cd libogg-1.3.1
./configure --disable-shared
make
make install
make distclean

# libvorbis
cd ~/ffmpeg_src
curl -O http://downloads.xiph.org/releases/vorbis/libvorbis-1.3.3.tar.gz
tar xzvf libvorbis-1.3.3.tar.gz
cd libvorbis-1.3.3
./configure --disable-shared
make
make install
make distclean

# ffmpeg
cd ~/ffmpeg_src
git clone --depth 1 git://source.ffmpeg.org/ffmpeg
cd ffmpeg
./configure --enable-gpl --enable-nonfree --enable-pthreads --enable-postproc --enable-libfdk_aac --enable-libmp3lame --enable-libvorbis --enable-filters --enable-runtime-cpudetect
make
make install
make distclean
```

## Credits

  See the [contributors](https://github.com/pilwon/node-neospeech/graphs/contributors).

## License

<pre>
The MIT License (MIT)

Copyright (c) 2012-2014 Pilwon Huh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

[![Analytics](https://ga-beacon.appspot.com/UA-47034562-9/node-neospeech/readme?pixel)](https://github.com/pilwon/node-neospeech)
