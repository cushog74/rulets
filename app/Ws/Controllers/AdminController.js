'use strict'

const RouletteService = use('App/Services/RouletteService')
const Ws = use('Ws')

class AdminController {

    constructor(socket, request) {
        this.socket = socket
        this.request = request
    }

    * onMessage(message) {
        for (let key in AdminController.LASTDATA)
            if (Object.keys(AdminController.LASTDATA[key]).length > 0)
                this.socket.toMe().emit('message', {
                    cmd: key,
                    data: AdminController.LASTDATA[key]
                })
    }

    disconnected(socket) {}

    static addInventoryInfo(money, count) {
      if (AdminController.LASTDATA.stats_inventory.graph.length >= 12)
        AdminController.LASTDATA.stats_inventory.graph = []
        const curDate = new Date()
        const graph = {
          cost: Math.round(money),
          date: curDate.getTime()
        }
        AdminController.LASTDATA.stats_inventory.graph.push(graph)
        AdminController.LASTDATA.stats_inventory.count = count

        Ws.channel('admin').emit('message', {
          cmd: 'stats_inventory',
          data: {graph: [graph], count: count}
        })
    }

    static monitorSend(key, value) {
        AdminController.LASTDATA[key] = value
        Ws.channel('admin').emit('message', {
            cmd: key,
            data: value
        })
    }

}

AdminController.LASTDATA = {
    stats_cpu: {},
    stats_ram: {},
    stats_disk: {},
    stats_inventory: {
        count: 0,
        graph: []
    }
}

module.exports = AdminController
