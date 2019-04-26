const hypersource = require('hypersource')
const hypercore = require('hypercore')
const debug = require('debug')('echo.hypersource.club')
const pump = require('pump')
const ram = require('random-access-memory')

const { PORT = 3000 } = process.env
const server = hypersource.createServer(onrequest)

server.on('error', debug)
server.listen(parseInt(PORT), (err) => {
  if (err) {
    console.error('ERR', err)
  } else {
    console.log('Listening on', server.address())
  }
})

function onrequest(req, res) {
  console.log('%s %s', req.method, req.url)
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
