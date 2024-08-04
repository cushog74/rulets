'use strict'

const Lucid = use('Lucid')

class History extends Lucid {

  static get table () {
    return 'history'
  }

  user () {
    return this.belongsTo('App/Model/User', 'steamid', 'steamid')
  }

}

module.exports = History
