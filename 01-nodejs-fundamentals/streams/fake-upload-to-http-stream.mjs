import { Readable } from 'node:stream'

// This is like the frontend making a request to the backend and sending a stream on the body.

class oneToHundredStream extends Readable {

  index = 1;

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 5) { // push is a method in a readable stream provide data to whoever is consuming it
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))

        this.push(buf)
      }
    }, 1000)
  }
}


fetch('http://localhost:3334', {
  method: 'POST',
  body: new oneToHundredStream()
}).then(response => response.text())
  .then(data => console.log(data))
