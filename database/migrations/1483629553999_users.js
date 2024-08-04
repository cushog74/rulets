'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('steamid').unique().notNullable()
      table.string('nickname').notNullable()
      table.string('avatar').notNullable()
      table.string('tradelink').notNullable()
      table.string('referral').notNullable()
      table.integer('status').notNullable().defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
