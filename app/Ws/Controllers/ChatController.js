'use strict'

class ChatController {

  constructor (socket, request) {
    this.socket = socket
    this.request = request
  }

  * onMessage (message) {
    switch (message.event) {
      case 'send':
        const user = this.socket.currentUser
        if (user)
            this.socket.toEveryone().emit('message', {
                "event": 'CGW_CHAT',
                "nickname": user.nickname,
                "avatar": user.avatar,
                "text": message.message.text
            })
        break
    }
  }

  disconnected (socket) {
  }

}
module.exports = ChatController
