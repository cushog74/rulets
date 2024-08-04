'use strict'

const Schema = use('Schema')

class ChatTableSchema extends Schema {

  up () {
    this.create('chats', (table) => {
      table.increments()
      table.string('nickname').notNullable()
      table.string('avatar').notNullable()
      table.string('staff').notNullable()
      table.string('message').notNullable()
      table.timestamps()
      table.softDeletes()
    })
  }

  down () {
    this.drop('chats')
  }

}

module.exports = ChatTableSchema
