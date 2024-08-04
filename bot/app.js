'use strict'

const Cluster = require('cluster')
const Axios = require('axios')

if (Cluster.isMaster) {
    const console2 = require('console2')({
        disableWelcome: 1,
        override: 0
    })
    let PriceList
    Axios.get("https://api.csgofast.com/price/all").then(result => PriceList = result.data)
    const SiteSocket = new(require('./class/SiteSocket'))(4267)
    const OnlineBots = []

    SiteSocket.on('message', message => {
        if (message.event == 'sendRequestOffer')
            OnlineBots[0].send({
                event: 'sendRequestOffer',
                tradelink: message.data.tradelink,
                items: message.data.items,
                caption: message.data.caption
            })

        if (message.event == 'sendWinnerOffer')
            OnlineBots[0].send({
                event: 'sendWinnerOffer',
                tradelink: message.data.tradelink,
                items: message.data.items,
                caption: message.data.caption
            })
    })

    Cluster.fork({
        login: 'login',
        password: 'pass',
        tfa: 'secret',
        idenitySecret: 'idenity'
    })

    for (const id in Cluster.workers) {
        Cluster.workers[id].on('message', message => {
            if (message.event == 'countInventory') {
                let pos = 0
                let price = 0.00
                message.inventory.forEach(item => {
                    price += PriceList[item.market_name]
                    pos++
                })
                SiteSocket.send(message.event, {
                    money: price,
                    count: pos,
                    tradebot: id
                })
            }

            if (message.event == 'steamAuthed')
                OnlineBots.push(Cluster.workers[id])

            if (message.event == 'tradeError') {
                SiteSocket.send(message.event, {
                    steamid: message.steamid,
                    error: message.error
                })
            }

            if (message.event == 'tradeRequestAccepted') {
                SiteSocket.send(message.event, {
                    owner: message.steamid,
                    items: message.items,
                    tradebot: id
                })
                console2.spacer().title('Master Message: ' + console2.col(message.event, 'green'), 'bold')
                console2
                    .line(console2.col('SteamID:', 'green') + ' ' + console2.col(message.steamid, 'white'))
                    .line(console2.col('Items Count:', 'yellow') + ' ' + console2.col(message.items.length, 'white'))
                    .spacer()
            }
        })
    }
} else if (Cluster.isWorker) {
    new(require('./class/SteamBot'))(process.env.login, process.env.password, process.env.tfa, process.env.idenitySecret)
}
