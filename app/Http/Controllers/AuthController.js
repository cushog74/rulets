'use strict'

const User = use('App/Model/User')
const Env = use('Env')

const SteamWebAPI = require('steam-web');
const OpenID = require('openid');
const relyingParty = new OpenID.RelyingParty(
  'http://' + Env.get('WEBSOCKET_HOST') + '/auth/callback', // Verification URL (yours)
  'http://' + Env.get('WEBSOCKET_HOST'), // Realm (optional, specifies realm for OpenID authentication)
  true, // Use stateless verification
  false, // Strict mode
  []
);


class AuthController {

  * LogOut(request, response) {
    yield request.auth.logout()
    response.redirect('/')
  }

  * SteamRedirect(request, response) {
    relyingParty.authenticate('http://steamcommunity.com/openid', false, function(error, authUrl) 	{
  		if (error) {
  			response.send('Authentication failed: ' + error.message)
  		}
  		else if (!authUrl) {
  			response.send('Authentication failed')
  		}
  		else {
  			response.redirect(authUrl)
  		}
  	});
  }

  * SteamCallback(request, response) {

    let verify = yield (
      new Promise(function(resolve, reject) {
        relyingParty.verifyAssertion(request.request, function(error, result) {
      		if(!error && result.authenticated) return resolve(result.claimedIdentifier)
          else return reject(error)
      	})
      })
    )

    let steamID = (/^http:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/).exec(verify)[1]
    let steam = new SteamWebAPI({ apiKey: Env.get('STEAM_WEBAPI'), format: 'json' })

    let playerInfo = yield (
      new Promise(function(resolve, reject) {
        steam.getPlayerSummaries({
          steamids: [ steamID ],
          callback: function(err, result) {
            if(err) reject(err)
            else resolve(result.response.players[0])
          }
        })
      })
    )

    let searchUser = {
      steamid: playerInfo.steamid
    }

    let referral = yield request.session.get('referral', '')
    let newUser = {
      steamid: playerInfo.steamid,
      nickname: playerInfo.personaname,
      avatar: playerInfo.avatarfull,
      status: 0,
      referral: referral,
      tradelink: ''
    }

    let loggedUser = yield User.findOrCreate(searchUser, newUser)

    yield request.auth.loginViaId(loggedUser.id)
    response.redirect('/')

  }

}

module.exports = AuthController
