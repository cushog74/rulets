'use strict'

const Net = require('net')
const Event = use('Event')

const Socket = new Net.Socket()
Socket.connect(4267, () => {
 console.log('Connected to SteamBots module')
})
Socket.on('data', (data) => {
	SteamBots.receiver(JSON.parse(data))
})
Socket.on('close', () => {
	console.log('Connection closed')
})

class SteamBots{
  static send(event, data) {
    Socket.write(JSON.stringify({
        event: event,
        data: data
    }))
  }

  static receiver(received) {
    Event.fire('SteamBots.'+received.event, received.data)
  }
}

module.exports = SteamBots
