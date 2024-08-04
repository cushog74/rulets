'use strict'

const Env = use('Env')
const RouletteService = use('App/Services/RouletteService')
const Validator = use('Validator')
const Chat = use('App/Model/Chat')
const User = use('App/Model/User')

class AdminController {

    * index(request, response) {
        yield response.sendView('admin/index', {
            siteName: Env.get('SITE_NAME'),
            webSocket: Env.get('WEBSOCKET_HOST'),
            steamAPIKey: Env.get('STEAM_WEBAPI')
        })
    }

    * backspin(request, response) {
        yield response.sendView('admin/backspin', {
            siteName: Env.get('SITE_NAME'),
            webSocket: Env.get('WEBSOCKET_HOST'),
            steamAPIKey: Env.get('STEAM_WEBAPI')
        })
    }

    * rules(request, response) {
        yield response.sendView('admin/rules', {
            siteName: Env.get('SITE_NAME'),
            webSocket: Env.get('WEBSOCKET_HOST'),
            steamAPIKey: Env.get('STEAM_WEBAPI')
        })
    }

    * changeUserRule(request, response) {
        const data = request.except('_csrf')

        const user = yield User.findBy('steamid', data.steamid)
        if (Object.keys(user).length == 0)
            return response.json({
                status: 'error',
                errors: [`Sorry, but user with SteamID ${data.steamid} doesn't exist in the DataBase!`]
            })

        user.status = data.level
        yield user.save()
        response.json({
            status: 'success'
        })
    }

    * addChatMessage(request, response) {
        const validation = yield Validator.validate(request.all(), {
            steamid: 'required|string|max:17',
            avatar: 'required|string|url|ends_with:.jpg',
            nickname: 'required|string',
            message: 'required|string'
        })

        if (validation.fails())
            return response.json({
                status: 'error',
                errors: validation.messages()
            })

        const data = request.except('_csrf', 'steamid')

        const message = yield Chat.create({
            nickname: data.nickname,
            avatar: data.avatar,
            staff: 0,
            message: data.message
        })
        message.sendToSocket()

        response.json({
            status: 'success'
        })
    }

    * setWinner(request, response) {
        const validation = yield Validator.validate(request.all(), {
            steamid: 'required|string|max:17'
        })
        if (validation.fails())
            return response.json({
                status: 'error',
                errors: validation.messages()
            })

        RouletteService.gameWinner = request.input('steamid')
        response.json({
            status: 'success',
            nickname: request.input('steamid')
        })
    }

    * addWeapon(request, response) {
        const validation = yield Validator.validate(request.all(), {
            steamid: 'required|string|max:17',
            classid: 'required|string',
            marketname: 'required|string',
            icon_url: 'required|string|min:150',
            price: 'required|string'
        })
        if (validation.fails())
            return response.json({
                status: 'error',
                errors: validation.messages()
            })

        const data = request.except('_csrf')
        yield RouletteService.addItem({
            "owner": data.steamid,
            "items": [{
                "class_id": data.classid,
                "assets_id": 0,
                "icon_url": data.icon_url,
                "market_name": data.marketname
            }]
        })

        response.json({
            status: 'success'
        })
    }

    * foundUser(request, response) {
        const found = yield User
            .query()
            .where('steamid', 'LIKE', '%'+request.input('user')+'%')
            .orWhere('nickname', 'LIKE', '%'+request.input('user')+'%')
            .fetch()
        if (found == false)
            return response.json({
                status: 'failed'
            })

        response.json({
            status: 'success',
            users: found.toJSON().map(item => {
                return {
                    steamid: item.steamid,
                    nickname: item.nickname,
                    avatar: item.avatar
                }
            })
        })
    }
}

module.exports = AdminController
