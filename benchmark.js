var from = require('from2')
var timeStream = require('./')
var protoBuf = require('protocol-buffers')
var encoder = protoBuf(`
  message Data {
    required uint32 speed=1;
    required uint32 neuron=2;
    required uint32 distance=3;
    required uint32 cor=4;
    required uint32 left=5;
    required uint32 right=6;
  }
`)

var object = {
  speed: 19,
  neuron: 22,
  distance: 31,
  cor: 19,
  left: 22,
  right: 31,
}

var dataCount = 1000000
var originalDataCount = dataCount

var stream = from.obj(function (size, callback) {
  dataCount --
  if (dataCount === 0) return callback(null, null)
  callback(null, object)
})

//stream.on('data', console.log)

var ts = timeStream.createWriteStream('test.data', encoder.Data)

var time = Date.now()
stream.pipe(ts)

ts.on('finish', function() {
  console.log(Math.round(1000*originalDataCount/(Date.now() - time)) + ' data / second')
})