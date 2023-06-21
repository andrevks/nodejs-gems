# NodeJS Fundamentals

Click on the links below to navigate to each section:

- [Fundamentals of stream: NodeJS Process (stdin and stdout)](#fundamentals-of-stream-nodejs-process-stdin-and-stdout)
- [Readable](#readable)
- [Writable](#writable)
- [Transform](#transform)
- [Consuming streams on impartial data](#consuming-streams-on-impartial-data)
- [Buffer](#buffer)
- [Middleware](#middleware)
- [URL](#url)
- [Routes Parameters](#routes-parameters)

## Fundamentals of stream: NodeJS Process (stdin and stdout)

In NodeJS any port I/O is automatically a stream.

For example, request and response are streams, so when a request is made in a NodeJS HTTP server, it's possible to let the request open and send data to it in little chunks of data, the same is applied to the response.

In NodeJS there are many I/Os, but the one we going to use is the process of NodeJS (aka stdin and stdout)to understand the fundamentals of streaming.

The **stdin** comes from the process, it's basically everything the user digits in the terminal.

If you can read data chunk by chunk, then you can send each of these data to a *stream* that will handle each data.

```js
process.stdin.pipe(process.stdout)
```

This code means everything received as input is being forwarded (pipe is a way to do that) to an output, in this case, the **stdout**. Usually it is normal to connect streams.

### Readable

A readable stream is one that will read chuck of data.Example:

```js
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
```

### Writable

A writable stream is a stream that will get data from a readable stream and will make something with each chuck of data (process the data, but not transform it). For example, the **stdout** is a writable stream, it process data. Example:

```js
 class MultiplyByTenStream extends Writable { 
  /**
   * @param {string} chunk | is the piece of data (chunk in buffer format) from the readable stream
   * @param {*} enconding | how the data is codificated
   * @param {*} callback | a function the writable stream call when it finishing processing each chunk of data
   */
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}
```

### Transform

A transform stream must to be in the middle of a readable and writable streams and it's feature is to transform the chunk of data. It calls the callback and pass the first parameter that's the error (in case it ocurred) and the second parameter which is the transformed data in Buffer format. Example:

```js
  class InverseNumberStream extends Transform {
    _transform(chunk, enconding, callback) {
      const transformed = Number(chunk.toString()) * -1
      callback(null, Buffer.from(String(transformed)))
    }
  }
```

Putting all of them together in the *fundamentals.js file*, the **oneToHundredStream** reads the index, increments it and put in the pipe, the **InverseNumberStream** takes this chuck and transforms it in a negative number, lastly the  **MultiplyByTenStream** multiplies each chunk by TEN.

### Consuming streams on impartial data

Sometimes when you want to get the whole data before doing something else, you can by using a **for await** to wait for each chunk, then you need to put all them together and do anything with it. Usually you will be dealing with data that can be partial like videos, songs and texts, but if you need to deal with JSON for example, it's horrible to guess parts of the data without getting all the data. Why tho?

Example:

```json
  //FULL DATA: 
  {"name": "André Geraldo", "username": "andrevks"}
  //Chunk:
  // {"name": "André Geraldo
  //you can't process it before getting the whole data
```

### Buffer

- Buffer is a representation of a space from the computer's RAM memory used to transmit data in a really fast way. So, data inside the Buffer is just temporary and will be deleted as soon as possible.

- Read data in binary is faster than any other format because it's a native format of the computer.

- So buffer is a way to JS (in NodeJS) deal with data in a binary way, really close to the computer language.

- The advantage is that it's really fast, that's why streams make use of it.

How buffer works?

It accepts string and transform them into binary, for example:

```js
const buff = Buffer.from("ok")
console.log(buff) // <Buffer 6f 6b> -> hexadecimal for O and K.

```

### Middleware

In short: **a function that intercept a request/response (or both) of a route**.

In Node.js, middleware acts like a middleman between incoming requests and route handlers. It's like an interceptor that lets us do things like parsing requests, handling authentication, logging, and managing errors. Middleware helps keep our code organized, reusable, and makes it easy to add extra functionality to requests and responses as they flow through the application.

### URL

Using EsModule the info about the path can be get from the *import.meta.url*, combining with URL you can create a new path with the name passed in the first param, in case you use **"../db.json"** it's like using a **cd..**. Example:

```js
  new URL('db.json', import.meta.url)
```

Also, by default when you pass the path, NodeJS will take into account the local where the server is being executed as the place to begin the path, that's why was used the URL and import.meta.url. Using this, doesn't matter where the server is executed.

### Routes Parameters

**Query Parameters**: URL stateful, when I want to save a state, can be use as filters, pagination and non-necessary params. Ex:

```js
  'http://localhost:3333/users?userId=1&name=André'
  // These params are not required, but give some filter or search result or whatever.
```

**Route parameters**: Used as resource identification. Ex:

```js
  GET 'http://localhost:3333/users/1'
  DELETE 'http://localhost:3333/users/1'
  // These params are require to identify which resource will be dealt with.
```

**Request Body**: Used to send information from a form, it's encrypted on HTTPs. Ex:

```js
  POST 'http://localhost:3333/users'
  PUT 'http://localhost:3333/users'
  // The body part is not part of the URL.
```

## **Improvements**

- Usage of *.mjs* files to be able to use top-level await
- Don't use promises in your constructor, always prefer to manipulate promises. When use promises, deal with them with async/await to garantee syncronism.Example:

```js
//BEFORE:
export class Database {
  #database = {}

  constructor() {
    // prefer to treat it using async/await and not calling in the constructor
    //deal with at after instantiating the object to not get unexpected results
    fs.readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }
  /*
    Don't have any async/await, this could lead to memory leak.
    The problem could be with sincronization, let say the file take 15s to be opened.
    The server is ready to listen and receiving request, but your app would get into a undesired transitory state.
    So when you call any methods of the database it doesn't exist or just loads soon after it.
  */
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
  //...
}

//AFTER:
export class Database {
  #database = {}

  async boot() {
    const data = await readFile(databasePath, 'utf-8')
    this.#database = JSON.parse(data)
  }

  async #persist() {
    await writeFile(databasePath, JSON.stringify(this.#database))
  }
//...
}

// Instantiate database and call the boot afterwards
const database = new Database()
await database.boot() // can you top-level await because of .mjs extension.

```
