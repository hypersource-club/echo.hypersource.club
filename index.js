const hypersource = require('hypersource')
const hypercore = require('hypercore')
const debug = require('debug')('echo.hypersource.club')
const pump = require('pump')
const ram = require('random-access-memory')

function createServer(opts) {
  const server = hypersource.createServer(onrequest)

  server.on('error', debug)

  return server

  function onrequest(req, res) {
    const source = hypercore(ram, req.key, req)
    const echo = hypercore(ram, res.key, res)

    source.on('error', debug)
    echo.on('error', debug)

    req.on('error', debug)
    res.on('error', debug)

    source.replicate(req)
    source.update(() => {
      pump(
        source.createReadStream(),
        echo.createWriteStream(),
        () => echo.replicate(res).once('close', onclose).on('end', onclose)
      )
    })

    function onclose() {
      source.close()
      echo.close()
    }
  }
}

module.exports = createServer
