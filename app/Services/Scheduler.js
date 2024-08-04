'use strict'

const Ws = use('Ws')
const Env = use('Env')
const Database = use('Database')
const co = require('co')
const RouletteService = use('App/Services/RouletteService')
const microstats = require('microstats')
const AdminController = use('App/Ws/Controllers/AdminController')

setInterval(() => {
  Ws.channel('chat').emit('message', {
    event: 'CGW_TOTALONLINE',
    online: Object.keys(Ws.channel('chat').io.connected).length
  })
}, 3000)

setInterval(() => {
  co(function * (){
    yield Database.truncate('chats')
    return null
  })
}, 30*60*1000)

setInterval(() => {
  Ws.channel('admin').emit('message', {
    cmd: 'round_players',
    data: RouletteService.players
  })
}, 2500)

microstats.on('memory', value => AdminController.monitorSend('stats_ram', value))
microstats.on('cpu', value => {
  if (value.time == 5)
    AdminController.monitorSend('stats_cpu', value)
})
microstats.on('disk', value => {
  if (value.filesystem == "/dev/sda1")
   AdminController.monitorSend('stats_disk', value)
})
microstats.start({ frequency: '5s' }, err => console.log(err))

module.exports = this
