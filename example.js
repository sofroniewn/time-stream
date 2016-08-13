var timeStream = require('./')
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

var tsR = timeStream.createReadStream('test.data', encoder.Data)

tsR.on('data', function (data) {
  console.log(data)
})