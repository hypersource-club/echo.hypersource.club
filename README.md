echo.hypersource.club
=====================

A simple HyperSource echo server

## Installation

```js
$ npm install -g echo.hypersource.club
```

## Usage

```sh
$ echo.hypersource.club --port 3000 --host '127.0.0.1'
```

or with `npx`

```sh
$ npx echo.hypersource.club --port 3000 --host '127.0.0.1'
```

Echo a message with
[hypersource-client](https://github.com/jwerle/hypersource-client).

```sh
$ echo hello | hsurl ws://echo.hypersource.club
hello
```

## API

### `server = require('echo.hypersource.club')()`

Create a [hypersource](https://github.com/jwerle/hypersource) server

#### Example

```js
const server = require('echo.hypersource.club')()
server.listen(3000)
server.on('request', (req) => {
  console.log('%s %s', req.method, req.url)
})
```

## License

MIT
