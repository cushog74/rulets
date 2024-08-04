'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  history () {
    return this.hasMany('App/Model/History', 'steamid', 'steamid')
  }
}

module.exports = User
