var tape = require('tape')
var timeStream = require('./')
var tempfile = require('tempfile')
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

tape('encodes data to files', function (t) {
  var filename = tempfile('test1')

  var ts = timeStream.createWriteStream(filename, encoder.Data)
  object.forEach(function (data) {
    ts.write(data)
  })

  ts.end(function () {
    var tsR = timeStream.createReadStream(filename, encoder.Data)
    var array = []

    tsR.on('data', function (data) {
      array.push(data)
    })

    tsR.on('end', function () {
      t.deepEquals(object, array)
      t.end()
    })
  })
})







