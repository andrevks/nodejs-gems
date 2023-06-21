// Readable Streams / Writable Streams
// Example: Import of clients via CSV (excel)
// process.stdin.pipe(process.stdout)

import {Readable, Writable, Transform} from 'node:stream'

class oneToHundredStream extends Readable {

  index = 1;

  _read() {
    const i = this.index ++

    setTimeout(() => {
      if (i > 100) { // push is a method in a readable stream provide data to whoever is consuming it
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))

        this.push(buf)
      }
    }, 1000)
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, enconding, callback) {
    const transformed = Number(chunk.toString()) * -1
    callback(null, Buffer.from(String(transformed)))
  }
}

class MultiplyByTenStream extends Writable { /**
   * @param {string} chunk | is the piece of data (chunk in buffer format) from the readable stream
   * @param {*} enconding | how the data is codificated
   * @param {*} callback | a function the writable stream call when it finishing processing each chunk of data
   */
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

new oneToHundredStream().pipe(new InverseNumberStream()).pipe(new MultiplyByTenStream())
// -10
// -20
// -30 ...
