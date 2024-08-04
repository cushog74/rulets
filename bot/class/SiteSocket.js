'use strict'
const Net = require('net')
const EventEmitter = require('events')
const console2 = require('console2')({
    isWorker: 1,
    override: 0
})

class SiteSocket extends EventEmitter{
  constructor(port) {
    super()

    this.Site = false
    const Server = Net.createServer((socket) => {
      this.Site = socket
      console2
        .title('Site Socket', 'bold')
        .info('Site connected to socket')
        .spacer()
      socket.on("error", (err) => console2.trace(err.stack))
      socket.on('data', (data) => this.receiver(JSON.parse(data)))
    })
    Server.listen(port)
    console2
      .title('Site Socket', 'bold')
      .info('Initialized on port: '+console2.col(port,'yellow'))
      .spacer()
  }

  send(event, data) {
    if (this.Site)
      this.Site.write(JSON.stringify({
          event: event,
          data: data
      }))
    else
      return false
  }

  receiver(received) {
    this.emit('message', received)
  }
}

module.exports = SiteSocket
