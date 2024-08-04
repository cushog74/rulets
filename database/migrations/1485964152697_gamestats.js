'use strict'

const Schema = use('Schema')

class GamestatsTableSchema extends Schema {

  up () {
    this.create('gamestats', (table) => {
      table.increments()
      table.string('lastNickname').notNullable()
      table.string('lastAvatar').notNullable()
      table.float('lastJackpot').notNullable().defaultTo(0.00)
      table.float('lastChance').notNullable().defaultTo(0.00)
      table.float('totalJackpot').notNullable().defaultTo(0.00)
      table.integer('totalGames').notNullable().defaultTo(0)
      table.integer('totalSkins').notNullable().defaultTo(0)
      table.integer('totalPlayers').notNullable().defaultTo(0)
      table.string('date').notNullable()
    })
  }

  down () {
    this.drop('gamestats')
  }

}

module.exports = GamestatsTableSchema
