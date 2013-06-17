# NeoSpeech

`neospeech` is a client library for [NeoSpeech TTS](http://neospeech.com/) written in [Node.js](http://nodejs.org/).

## Installation

    $ npm install neospeech

## Usage

```js
var neospeech = require('neospeech');
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
