bulk = require('bulk-write-stream')
fs = require('fs')
varint = require('varint')
lengthPrefixedStream = require('length-prefixed-stream')
through2 = require('through2')

module.exports = {
  createWriteStream: function (filename, encoder) {
    var fd = -1    
    var buffer = new Buffer(1024)

    function open (list, callback) {
      fs.open(filename, 'a', function(err, result) {
        if (err) {
          return callback(err)
        }
        fd = result
        write(list, callback)
      })
    }
    
    function write (list, callback) {
      if (fd === -1) return open(list, callback)

      var bytesNeeded = 0

      for (var i=0; i<list.length; i++) {
        var data = list[i]
        bytesNeeded += encoder.encodingLength(data)
        bytesNeeded += varint.encodingLength(encoder.encodingLength(data))
      }

      if (bytesNeeded > buffer.length) {
        buffer = new Buffer(Math.max(2*buffer.length, bytesNeeded))
      }

      var offset = 0
      for (var i=0; i<list.length; i++) {
        var data = list[i]
        varint.encode(encoder.encodingLength(data), buffer, offset)
        offset += varint.encode.bytes
        encoder.encode(data, buffer, offset)
        offset += encoder.encode.bytes
      }

      fs.write(fd, buffer, 0, offset, callback)
    }
    
    return bulk.obj(write)
  },
  createReadStream: function (filename, encoder) {
    var rs = fs.createReadStream(filename)
    var decoder = through2.obj(function (data, enc, callback) {
      callback(null, encoder.decode(data))
    })
    return rs.pipe(lengthPrefixedStream.decode()).pipe(decoder)
  }
}