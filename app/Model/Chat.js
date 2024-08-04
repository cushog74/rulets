'use strict'

const Lucid = use('Lucid')
const Ws = use('Ws')

class Chat extends Lucid {
  sendToSocket () {
    Ws.channel('roulette').emit('message', {
      cmd: 'update_chat',
      data: {
        id: this.id,
        message: this.message,
        user: {
          steamid: 0,
          nickname: this.nickname,
          photo: this.avatar,
          chat_color: '',
          chat_icon: '',
          staff: this.staff
        },
        date: this.created_at
      }
    })
  }
}

module.exports = Chat
