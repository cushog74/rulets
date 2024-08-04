'use strict'

const SteamBots = exports = module.exports = {}
const RouletteService = use('App/Services/RouletteService')
const AdminController = use('App/Ws/Controllers/AdminController')
const Ws = use('Ws')
const co = require('co')

SteamBots.tradeRequestAccepted = data => {
    co(function*() {
        yield RouletteService.addItem(data)
    })
}

SteamBots.tradeError = data => {
    Ws.channel('chat').emit('message', {
        event: 'CGW_NOTIFY',
        message: 'DECLINE_2'
    })
}

SteamBots.countInventory = data => {
    AdminController.addInventoryInfo(data.money, data.count)
}
