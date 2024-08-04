'use strict'

const RouletteService = use('App/Services/RouletteService')
const GameStats = use('App/Model/GameStats')
const History = use('App/Model/History')
const User = use('App/Model/User')
const Ws = use('Ws')
const axios = require('axios')

class AJAXController {
    * Inventory(request, response) {
        let inventory = []
        let objects_concat = function(a, b) {
            let c = {}, key;
            for (key in a) {
                if (a.hasOwnProperty(key)) {
                    c[key] = key in b ? b[key] : a[key];
                }
            }
            return c;
        }
        axios.get('http://steamcommunity.com/inventory/' + request.currentUser.steamid + '/730/2?l=english&count=5000')
          .then(result => {
            if (
              typeof(result.data.total_inventory_count) != 'undefined' &&
              result.data.total_inventory_count == 0
            ) return response.send([])
            else
              result.data.assets.forEach((item) => {
                  let description = result.data.descriptions.find(desc => desc.classid == item.classid)
                  description.assetid = 0
                  if (description.tradable == 1) {
                      let object = objects_concat(description, item)
                      object.price = RouletteService.Prices[object.market_name]
                      inventory.push(object)
                  }
              })

            response.send(inventory)
        })
        .catch(error => {
            response.send([])
        })
    }

    * Game(request, response) {
        const statsToday = yield GameStats.getToday()

        const output = {
            "stats": {
                "usersOnline": Object.keys(Ws.channel('chat').io.connected).length,
                "largestPot": statsToday.totalJackpot,
                "recentWinner": null
            },
            "round": {
                "items": RouletteService.items,
                "pot": RouletteService.gameBank.toFixed(2),
                "state": "live",
                "id": RouletteService.gameId,
                "players": RouletteService.players,
                "serverTime": (new Date().getTime()),
                "lastBetOn": RouletteService.gameStarts,
                "recentWinner": null
            }
        }

        response.send(output)
    }

    * History(request, response) {
        const history_model = yield History.with('user').pickInverse(12)
        let output = new Array()
        history_model.toJSON().forEach((round) => {
            round.skins = JSON.parse(round.skins)
            output.push({
                "id": round.gameid,
                "jackpot": round.jackpot,
                "won_items": round.skins,
                "winner": {
                    "steamid": round.user.steamid,
                    "avatar": round.user.avatar,
                    "name": round.user.nickname,
                    "chance": round.chance
                },
                "playersCount": round.players
            })
        })
        response.send(output)
    }

    * LastWinners(request, response) {
        let output = new Array()
        const history_model = yield History.with('user').pickInverse(3)
        history_model.toJSON().forEach((round) => {
          output.push({
              "id": round.gameid,
              "jackpot": round.jackpot,
              "winner": {
                  "steamID": round.user.steamid,
                  "avatar": round.user.avatar,
                  "name": round.user.nickname,
                  "chance": round.chance
              },
              "playersCount": round.players
          })
        })
        response.send(output)
    }

    * Rating(request, response) {
        let output = {
            "money": [],
            "referrals": [],
            "week": []
        }
        const user_model = yield User.with('history').fetch()
        user_model.toJSON().forEach((user) => {
          const money = user.history.reduce((sum, round) => {
            return sum + round.jackpot
          }, 0)
          output.money.push({
              "name": user.nickname,
              "steamid": user.steamid,
              "wins": user.history.length,
              "money": money,
              "avatar": user.avatar
          })
        })
        output.money.sort((a, b) => {
          return b.money - a.money
        })
        response.send(output)
    }

}

module.exports = AJAXController
