'use strict'

const Command = use('Command')
const User = use('App/Model/User')

class MakeAdmin extends Command {

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  get signature () {
    return 'makeAdmin {steamid} {level}'
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  get description () {
    return 'It allows the user to administer'
  }

  /**
   * handle method is invoked automatically by ace, once your
   * command has been executed.
   *
   * @param  {Object} args    [description]
   * @param  {Object} options [description]
   */
  * handle (args, options) {
    let user = yield User.findBy('steamid', args.steamid)
    if (Object.keys(user).length == 0)
      return this.error(`Sorry, but user with SteamID ${args.steamid} doesn't exist in the DataBase!`)

    user.status = args.level
    yield user.save()

    this.info(`Now user ${args.steamid} has admin rights with level ${args.level}!`)
  }

}

module.exports = MakeAdmin
