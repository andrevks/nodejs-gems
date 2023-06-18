# NodeJS fundamentals of stream

In NodeJS any port I/O is automatically a stream.

For example, request and response are streams, so when a request is made in a NodeJS HTTP server, it's possible to let the request open and send data to it in little chunks of data, the same is applied to the response.

In NodeJS there are many I/Os, but the one we going to use is the process of NodeJS (aka stdin and stdout)to understand the fundamentals of streaming.

The **stdin** comes from the process, it's basically everything the user digits in the terminal.

If you can read data chunk by chunk, then you can send each of these data to a *stream* that will handle each data.

```js
process.stdin.pipe(process.stdout)
```

This code means everything received as input is being forwarded (pipe is a way to do that ) to an output, in this case, the **stdout**.
