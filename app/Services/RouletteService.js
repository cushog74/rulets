'use strict'

const Ws = use('Ws')
const History = use('App/Model/History')
const GameStats = use('App/Model/GameStats')
const User = use('App/Model/User')
const SteamBots = use('App/Services/SteamBots')
const co = require('co')
const axios = require('axios')

class RouletteService {

    static * endGame() {
        if (!RouletteService.gameWinner) {
            const randNumber = Math.floor(Math.random() * (RouletteService.gameBank + 1))
            for (const i in RouletteService.items) {
                const minimum = 0
                if (i != 0) minimum = (RouletteService.items[i - 1].price.toFixed(2) * 100)
                const current = minimum + (RouletteService.items[i].price.toFixed(2) * 100)
                if (minimum < randNumber || randNumber < current) {
                    RouletteService.gameWinner = RouletteService.items[i].owner
                    break
                }
            }
        }
        const winnerObject = yield RouletteService.getPlayer(RouletteService.gameWinner)

        let itemsToSend = []
        let comission = RouletteService.gameBank * 0.1
        const itemsFork = RouletteService.items.slice().sort((a, b) => {
          return a.price - b.price
        })
        for (const i in itemsFork) {
          if ((comission - itemsFork[i].price) > 0) {
            comission -= itemsFork[i].price
            continue
          }
          itemsToSend.push({market_name: itemsFork[i].market_name})
        }

        SteamBots.send('sendWinnerOffer', {
            tradelink: winnerObject.tradelink,
            items: itemsToSend,
            caption: 'Winner on the site: csgox.net'
        })

        Ws.channel('roulette').emit('message', {
            event: 'ROUND_FINISHED',
            players: RouletteService.players,
            winner: winnerObject,
            jackpot: RouletteService.gameBank
        })

        co(function*() {
            yield History.create({
                gameid: RouletteService.gameId,
                steamid: winnerObject.steamid,
                skins: JSON.stringify(RouletteService.items),
                players: RouletteService.players.length,
                jackpot: RouletteService.gameBank,
                chance: winnerObject.chance
            })

            yield GameStats.updateToday(
                RouletteService.gameBank,
                RouletteService.items.length,
                RouletteService.players.length, {
                    nickname: winnerObject.nickname,
                    avatar: winnerObject.avatar,
                    jackpot: RouletteService.gameBank,
                    chance: winnerObject.chance
                }
            )
        }).then(function() {
            RouletteService.clearVars()
            RouletteService.gameId++
            Ws.channel('roulette').emit('message', {
                event: 'ROUND_LIVE',
                id: RouletteService.gameId
            })
        })
    }

    static calcChances() {
        for (const i in RouletteService.players) {
            const items = RouletteService.items.filter(x => x.owner == RouletteService.players[i].steamid)
            const bank = items.reduce((previousValue, item) => {
                return previousValue + item.price
            }, 0)
            RouletteService.players[i].bank = bank
            RouletteService.players[i].chance = (bank * 100 / parseFloat(RouletteService.gameBank)).toFixed(2)
        }
    }

    static * getPlayer(steamid) {
        let player = RouletteService.players.find(x => x.steamid == steamid)
        if (typeof player == 'undefined') {
            const user = yield User.findByOrFail('steamid', steamid)
            if (user == false)
                return false

            player = {
                "steamid": user.steamid,
                "nickname": user.nickname,
                "tradelink": user.tradelink,
                "avatar": user.avatar,
                "bank": 0.00,
                "chance": 0
            }
            RouletteService.players.push(player)
        }
        player.items = RouletteService.items.filter(x => x.owner == steamid)
        return player
    }

    static * addItem(bet) {
        const player = yield RouletteService.getPlayer(bet.owner)
        if (!player) return false

        bet.bank = 0
        bet.items.forEach((item) => {
            item.price = RouletteService.Prices[item.market_name]
            bet.bank += item.price
            RouletteService.gameBank += +parseFloat(item.price).toFixed(2)
            item.owner = bet.owner
            RouletteService.items.push(item)
        })

        bet.owner_name = player.nickname
        bet.owner_avatar_url = player.avatar

        RouletteService.calcChances()

        Ws.channel('roulette').emit('message', {
            event: 'NEW_BET',
            pot: RouletteService.gameBank,
            bet: bet
        })

        if (RouletteService.gameStarts == 0 && RouletteService.players.length >= 2) {
            RouletteService.gameStarts = Date.now()
            RouletteService.gameEnds = RouletteService.gameStarts + 120000

            setTimeout(() => {
                co(function*() {
                    return yield RouletteService.endGame()
                })
            }, RouletteService.gameEnds - RouletteService.gameStarts)
        }
    }

    static clearVars() {
        RouletteService.items = new Array()
        RouletteService.players = new Array()
        RouletteService.gameStarts = 0
        RouletteService.gameEnds = 0
        RouletteService.gameBank = 0.00
        RouletteService.gameWinner = false
    }

    static setWinner(steamid) {
        const _winner = RouletteService.items.find(x => x.steamid == steamid)
        if (typeof _winner == 'undefined')
            return false

        RouletteService.gameWinner = _winner
        return _winner.nickname
    }

}

axios.get("https://api.csgofast.com/price/all").then(result => RouletteService.Prices = result.data)
co(function*() {
    return yield History.first()
}).then(first => {
    if (first)
        RouletteService.gameId = first.gameid + 1
    else
        RouletteService.gameId = 1
})

module.exports = RouletteService
