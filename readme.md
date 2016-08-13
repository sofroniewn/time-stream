# time-stream
Stream timeseries data to a file

```
npm install time-stream
```

This is a high performance module for writing streams of timeseries data to a file. Useful for streaming data at high frequency.

## Usage

```js
var timeStream = require('time-stream')
var protoBuf = require('protocol-buffers')
var encoder = protoBuf(`
  message Data {
    required uint32 speed=1;
    required uint32 neuron=2;
    required uint32 distance=3;
  }
`)

var object = [{
    speed: 19,
    neuron: 22,
    distance: 31,
  },
  {
    speed: 4,
    neuron: 5,
    distance: 6
  },
  {
    speed: 7,
    neuron: 8,
    distance: 9
  }
]


var ts = timeStream.createWriteStream('test.data', encoder.Data)
object.forEach(function (data) {
  ts.write(data)
})

ts.end(function () {
  var tsR = timeStream.createReadStream('test.data', encoder.Data)

  tsR.on('data', function (data) {
    console.log(data)
  })

})
```

## API

#### `var stream = timeStream.createWriteStream(filename, encoder)`
Create a new writable stream that appends timeseries data to the file specified by the filename using an encoder that has an encodingLength and encode and decode methods, similar to the protocol-buffers module.

#### `var stream = timeStream.createReadStream(filename, encoder)`
Create a new readable stream that reads data from the file specified by filename. The encoder is the same as the above writeStream encoder.


## License
MIT