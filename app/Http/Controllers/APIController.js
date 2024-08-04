'use strict'

const RouletteService = use('App/Services/RouletteService')
const GameStats = use('App/Model/GameStats')
const History = use('App/Model/History')
const User = use('App/Model/User')
const SteamBots = use('App/Services/SteamBots')
const Env = use('Env')
const axios = require('axios')

class APIController {
    * UpdateLink(request, response) {
        const regexp = /http(s?):\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=([0-9]+)&token=([a-zA-Z0-9]+)/gi
        if (regexp.test(request.input('token'))) {
            request.currentUser.tradelink = request.input('token')
            yield request.currentUser.save()
            response.send({
                'status': 'success'
            })
        } else {
            response.send({
                'status': 'failed',
                'error': 'GAME_TRADELINK_NULL'
            })
        }
    }

    * Deposit(request, response) {
        const regexp = /http(s?):\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=([0-9]+)&token=([a-zA-Z0-9]+)/gi
        if (!regexp.test(request.currentUser.tradelink)) {
            return response.send({
                'status': 'failed',
                'error': 'DECLINE_2'
            })
        }
        const params = request.except('_csrf')
        if (params.items.length == 0)
            return response.send({
                'status': 'failed',
                'error': 'DECLINE_11'
            })
        if (params.items.length > 10)
            return response.send({
                'status': 'failed',
                'error': 'DECLINE_3'
            })

        axios.get('http://steamcommunity.com/inventory/' + request.currentUser.steamid + '/730/2?l=english&count=5000')
            .then(result => {
                    if (typeof(result.data.total_inventory_count) != 'undefined' && result.data.total_inventory_count == 0)
                        return response.send({
                            'status': 'failed',
                            'error': 'DECLINE_6'
                        })

                    else {
                        const unique = params.items.filter((it, i, ar) => ar.indexOf(it) === i)
                        const countPrice = unique.reduce((sum, item) => {
                            let fullAsset = result.data.assets.find(asset => asset.assetid == item)
                            let description = result.data.descriptions.find(desc => desc.classid == fullAsset.classid)
                            return sum + parseFloat(RouletteService.Prices[description.market_name])
                        }, 0)

                        if (countPrice <= 0.01)
                            return response.send({
                                'status': 'failed',
                                'error': 'DECLINE_7'
                            })

                        const items = params.items.map(item => {
                            return {
                                appid: '730',
                                contextid: '2',
                                assetid: item
                            }
                        })
                        SteamBots.send('sendRequestOffer', {
                            tradelink: request.currentUser.tradelink,
                            items: items,
                            caption: 'Bet on the site: CSGOX.NET'
                        })
                        response.send({
                            'status': 'success'
                        })
                    }
            })
            .catch(error => {
                return response.send({
                    'status': 'failed',
                    'error': 'DECLINE_6'
                })
            })
    }

    * TestQuery(request, response) {
        response.ok()
    }

}

module.exports = APIController
