'use strict'

const Schema = use('Schema')

class HistoryTableSchema extends Schema {

  up () {
    this.create('history', (table) => {
      table.increments()
      table.integer('gameid').notNullable()
      table.string('steamid').notNullable()
      table.text('skins').notNullable()
      table.integer('players').notNullable().defaultTo(2)
      table.float('jackpot').notNullable().defaultTo(0.00)
      table.float('chance').notNullable().defaultTo(0.00)
      table.timestamps()
    })
  }

  down () {
    this.drop('history')
  }

}

module.exports = HistoryTableSchema
