'use strict'

const RouletteService = use('App/Services/RouletteService')

class RouletteController {

    constructor(socket, request) {
        this.socket = socket
        this.request = request
    }

    * onMessage(message) {
        switch (message.event) {
            case 'CGW_WHOAMI':
                const user = this.socket.currentUser
                if (user)
                    this.socket.toMe().emit('message', {
                        "event": 'CGW_WHOAMI',
                        "steamid": user.steamid,
                        "nickname": user.nickname,
                        "avatar_url": user.avatar,
                        "trade_url": user.tradelink,
                        "logged_in": true,
                        "iat": 1488731574,
                        "exp": 1488817974
                    })
                break
        }
    }

    disconnected(socket) {

    }

}

module.exports = RouletteController