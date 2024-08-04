'use strict'

const Lucid = use('Lucid')
const moment = require('moment')
const co = require('co')

class GameStats extends Lucid {

  static get table () {
    return 'gamestats'
  }

  static get createTimestamp () {
    return null
  }

  static get updateTimestamp () {
    return null
  }

  static get deleteTimestamp () {
    return null
  }

  static * updateToday (jackpot, items, players, lastWinner) {
    let stats = yield GameStats.getToday()

    stats.totalGames++
    stats.totalSkins += parseInt(items)
    stats.totalPlayers += parseInt(players)

    jackpot = parseFloat(jackpot).toFixed(2)
    if (jackpot > stats.totalJackpot)
      stats.totalJackpot = jackpot

    stats.lastNickname = lastWinner.nickname,
    stats.lastAvatar = lastWinner.avatar
    stats.lastJackpot = parseFloat(lastWinner.jackpot).toFixed(2)
    stats.lastChance = parseFloat(lastWinner.chance).toFixed(2)

    yield stats.save()
  }

  static * getToday () {
    let find = {
      date: moment().format("DD-MM-YYYY")
    }

    let create = {
      totalJackpot: 0.00,
      totalGames: 0,
      totalSkins: 0,
      totalPlayers: 0,
      lastNickname: 'work@ekifox.me',
      lastAvatar: 'http://cdn.edgecast.steamstatic.com/steamcommunity/public/images/avatars/65/653b54e7e5fdf0c6c1a1013f168f6461feef6e74_full.jpg',
      lastJackpot: 120.50,
      lastChance: 49.99,
      date: moment().format("DD-MM-YYYY")
    }

    return yield GameStats.findOrCreate(find, create)
  }

}

module.exports = GameStats
