'use strict'

const console2 = require('console2')({
    isWorker: 1,
    override: 0
})
const fs = require('fs')
const co = require('co')

const TradeOfferManager = require('steam-tradeoffer-manager')
const SteamUser = new(require('steam-user'))()
const OfferManager = new TradeOfferManager({
    "steam": SteamUser, // Polling every 30 seconds is fine since we get notifications from Steam
    "domain": "google.com", // Our domain is example.com
    "language": "en" // We want English item descriptions
})
const SteamCommunity = new(require('steamcommunity'))()

class SteamBot {
    constructor(login, password, tfa, idenitySecret) {
        this.idenitySecret = idenitySecret
        this.steamAuth(login, password, tfa, idenitySecret)
        process.on('message', message => {
            if (message.event == 'sendRequestOffer')
                this.sendRequestOffer(message.tradelink, message.items, message.caption)
            if (message.event == 'sendWinnerOffer')
                this.sendWinnerOffer(message.tradelink, message.items, message.caption)
        })
    }

    offerChanged(offer, oldState) {
        if (TradeOfferManager.ETradeOfferState[offer.state] == "Accepted" && offer.itemsToGive.length == 0) {
            process.send({
                event: 'tradeRequestAccepted',
                steamid: offer.partner.getSteamID64(),
                items: offer.itemsToReceive.map((item) => {
                    return {
                        appid: item.appid,
                        contextid: item.contextid,
                        assetid: item.assetid,
                        classid: item.classid,
                        instanceid: item.instanceid,
                        amount: item.amount,
                        icon_url: item.icon_url,
                        tradable: item.tradable,
                        market_name: item.market_name
                    }
                })
            })
        }
    }

    sendWinnerOffer(tradelink, items, message) {
        OfferManager.getInventoryContents(730, 2, true, (error, inventory) => {
            if (error)
                return console2.warn(error)
            if (inventory.length == 0)
                return console2.warn('CS:GO inventory is empty')

            let myItems = new Array()
            for (const item in items) {
                const found = inventory.find(x => x.market_name == items[item].market_name)
                if (found) {
                    myItems.push(found)
                    continue
                }
            }

            try {
                const offer = OfferManager.createOffer(tradelink)
                offer.addMyItems(myItems)
                offer.setMessage(message)
                offer.send((error, status) => {
                    if (error) {
                      process.send({
                          event: 'tradeError',
                          steamid: offer.partner.getSteamID64(),
                          error: error
                      })
                      console2.warn(error)
                    }

                    if (status == 'pending')
                        this.mobileConfirmation(offer.id)
                })
            } catch (ctherr) {
                console2.warn(ctherr)
            }
        })
    }

    sendRequestOffer(tradelink, items, message) {
        try {
            const offer = OfferManager.createOffer(tradelink)
            offer.addTheirItems(items)
            offer.setMessage(message)
            offer.send((error, status) => {
                if (error)
                    process.send({
                        event: 'tradeError',
                        steamid: offer.partner.getSteamID64(),
                        error: error
                    })

                if (status == 'pending')
                    this.mobileConfirmation(offer.id)
            })
        } catch (ctherr) {
            console2.warn(ctherr)
        }
    }

    steamAuth(login, password, tfa, idenitySecret) {
        SteamUser.setOptions('promptSteamGuardCode', false)
        const tfacode = (require('steam-totp')).generateAuthCode(tfa)
        SteamUser.logOn({
            accountName: login,
            password: password,
            twoFactorCode: tfacode,
            machineName: 'Bot CSGOX'
        })
        SteamUser.on('webSession', (sessionID, newCookie) => {
            OfferManager.setCookies(newCookie, error => {
                if (error) console2.spacer().title('Worker: ' + login, 'bold').warn(error)
                console2.title('Worker: ' + login, 'bold')
                    .info('Authorization in ' + console2.col('Steam', 'magenta') + ' is successful')
                    .log(console2.col("Steam ID:", "blue") + ' ' + console2.col(SteamUser.steamID, "white"))
                    .log(console2.col("2FA Code:", "yellow") + ' ' + console2.col(tfacode, "white"))
                    .log(console2.col("API Key:", "cyan") + ' ' + console2.col(OfferManager.apiKey, "white"))
                if (fs.existsSync('polldata_' + SteamUser.steamID + '.json'))
                    OfferManager.pollData = JSON.parse(fs.readFileSync('polldata_' + SteamUser.steamID + '.json'))
                setTimeout(() => this.countInventory(), 5000)
            })
            OfferManager.on('pollData', pollData => {
                fs.writeFile('polldata_' + SteamUser.steamID + '.json', JSON.stringify(pollData), function() {});
            })
            OfferManager.on('sentOfferChanged', this.offerChanged)
            process.send({
                event: 'steamAuthed'
            })
            SteamCommunity.setCookies(newCookie)
        })
    }

    mobileConfirmation(offerid) {
        SteamCommunity.acceptConfirmationForObject(this.idenitySecret, offerid, ((error) => {
            if (error)
                console2.warn(error)
            else
                console2.log("Offer confirmed")
        }))
    }

    countInventory() {
        OfferManager.loadInventory(730, 2, true, (error, inventory) => {
            if (error)
                console2.warn(error)

            process.send({
                event: 'countInventory',
                inventory: inventory
            })
        })
        setTimeout(() => this.countInventory(), 1800000)
    }
}
module.exports = SteamBot
