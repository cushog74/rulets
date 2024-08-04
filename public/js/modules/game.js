var mod = angular.module('game', [])
    .directive('onFinishRender', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });

mod.controller('RulesCtrl', function($scope, $rootScope) {
    $rootScope.showContent = true
})

mod.controller('InviteCtrl', function($scope, $rootScope) {
    $rootScope.showContent = true
})

mod.controller('WeekCtrl', function($scope, $rootScope) {
    $rootScope.showContent = true
})

mod.controller('SettingsCtrl', function($scope, $rootScope, $http, $translate) {
    function ParseTradeURL(inputURL) {
        if (!inputURL) return null
        var regexp = /http(s?):\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=([0-9]+)&token=([a-zA-Z0-9]+)/gi
        if (regexp.test(inputURL)) return inputURL
        return false
    }
    $scope.test = function() {
        alert();
    }

    $scope.SaveTradeToken = function(inputObj) {
        var msg1 = 'Вставь ссылку для обмена в поле'
        if ($translate.use() != 'ru') msg1 = 'Paste your trade URL first'
        if (!inputObj.tradeTokenTmp) return alertify.error(msg1, 2500)

        var msg2 = 'Токен не изменился'
        if ($translate.use() != 'ru') msg2 = 'Token has not changed'
        if (inputObj.tradeTokenTmp == $rootScope.tradeTokenTmp) return alertify.error(msg2, 2500)

        var tradeToken = ParseTradeURL(inputObj.tradeTokenTmp)
        var msg3 = 'Токен имеет неверный формат'
        if ($translate.use() != 'ru') msg3 = 'Token has invalid format'
        if (tradeToken == false) return alertify.error(msg3, 2500)

        $http.post('/ajax/updatelink', {
                'token': tradeToken,
                '_csrf': csrf_token
            })
            .success(function(data) {
                if (data.status == 'failed')
                    alertify.error($translate.instant(data.error), 1500)
                else {
                    var msg4 = 'Токен успешно сохранен'
                    if ($translate.use() != 'ru') msg4 = 'Token saved'
                    alertify.success(msg4, 2500)
                    $scope.whoami.tradeToken = tradeToken
                    $rootScope.tradeTokenTmp = tradeToken
                    $scope.tradeTokenTmp = tradeToken
                    console.log('new token ' + tradeToken)
                    $scope.$apply()
                    window.location = '#/'
                }
            })
    }
    $rootScope.showContent = true
})

/*mod.controller('LotteryCtrl', function($scope, $rootScope, lottery) {
    $scope.lottery = lottery.data
    $scope.prize = lottery.data[0].prize;
    var started = new Date(lottery.data[0].date_started * 1000);
    $.get("http://csgowinner.ru/ajax/lotteryGiveaway", function(data) {
        var users = JSON.parse(data);
        var users_pl = users;
        var users_in = users.length;
        vvar winner_steamid = "1";
        ar winner_nickname = "test";
        for (i = 0; i < users_in; i++) {
            console.log(users[i]);
            $("#final").append("<img src='" + users[i].avatar_url + "' steamid='" + users[i].steamid + "' style='width:100px;height:100px'>");
        }

        users_pl.forEach(function(el, ind) {
            if (el.steamid == winner_steamid) {
                users_pl.splice(ind, 1);
            }
        });

        function showLoser() {
            if (users_pl.length != 0) {
                var ind = rand(0, users_pl.length - 1);
                var steamid = users_pl[ind].steamid;
                users_pl.splice(ind, 1);
                $('img[steamid=' + steamid + ']').addClass("loser");
            } else {
                alertify.alert("Победил " + winner_nickname);
                clearInterval(showWinner);
            }
        }

        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var showWinner = setInterval(showLoser, 500);
    });
    var countdown = new Date(lottery.data[0].date_finished * 1000);
    $("raffle_countdown").countdown(countdown, function(event) {
        if (event.elapsed) {

        } else {
            var totalHours = event.offset.totalDays * 24 + event.offset.hours;
            $(this).text(
                event.strftime(totalHours + ':%M:%S')
            );
        }

    });
    var qwe = setInterval(function() {
        //console.log($rootScope.whoami.steamID)

        if ($rootScope.whoami.steamID != null) {
            $("#deposit").show();
            var inRaffle = false;
            var keysCount = 0;
            lottery.data.forEach(function(el) {
                if (el.steamid == $rootScope.whoami.steamID) {
                    inRaffle = true;
                    keysCount = el.keysCount;
                }
            })
            $scope.$apply(function() {
                $scope.inRaffle = inRaffle;
                if (inRaffle == true) { $("#pr").show(); } else { $("#nepr").show(); }

                $scope.keysCount = keysCount + ' ' + declOfNum(keysCount, ['ключ', 'ключа', 'ключей']);
            });
            clearInterval(qwe);
        }
    }, 100);
    $rootScope.showContent = true;

})*/

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}
mod.controller('GameCtrl', function($scope, $route, $rootScope, $translate, roundDescObj) {
    var roundDesc = roundDescObj.data;
    var online = roundDesc.round.online;

    $scope.translateChange = language => {
        localStorage.setItem('translation', language)
        $translate.use(language).then(() => {
            setTimeout(() => $route.reload(), 10)
        })
    }

    $scope.activeGame = {
        round: null,
        state: null,
        pot: null,
        itemCount: null,
        bets: [],
        tradeURL: 'https://steamcommunity.com/tradeoffer/new/?partner=222464089&token=ob4ajBqb',
        timerActive: false
    }

    $scope.stats = {
        largestPot: 0,
        recentWinner: null,
        usersOnline: online
    }
    var roundCircleTime = 120;
    var roundCircleInterval;
    var roundTimeout = 120000

    var BetSound = new Audio('/sounds/bet.wav')
    BetSound.volume = 0.05
    var WinnerSound = new Audio('/sounds/winner.wav')
    WinnerSound.volume = 0.05
    WinnerSound.loop = true
    var PreCarouselSound = new Audio('/sounds/pre_carousel.wav')
    PreCarouselSound.volume = 0.05

    $scope.disableSound = function() {
        $scope.soundActive = !$scope.soundActive
        if ($scope.soundActive) {
            alertify.success($translate.instant('SOUND_turnedOn'), 1500)
            $(".panel_control_link_text").text($translate.instant('HEADER_offSound'))
        } else {
            alertify.success($translate.instant('SOUND_turnedOff'), 1500)
            $(".panel_control_link_text").text($translate.instant('HEADER_onSound'))
        }

    }

    $scope.soundActive = true

    function playSound(type) {
        if (!$scope.soundActive) return false
        if (type == 'bet') BetSound.play()
        if (type == 'winner') {
            WinnerSound.play()
            setTimeout(function() {
                WinnerSound.pause()
                WinnerSound.currentTime = 0
            }, 4000)
        }
        if (type == 'preCarousel') PreCarouselSound.play()
    }

    var clock = angular.element('#clock')
    var timeLeft = Date.now() + roundTimeout
    if (roundDesc.round.lastBetOn) {
        timeLeft = Date.now() + (roundTimeout - (roundDesc.round.serverTime - roundDesc.round.lastBetOn))
        roundCircleTime = Math.round(timeLeft / 1000) - (Date.now() / 1000 | 0);
        console.log(roundCircleTime);
        $scope.activeGame.timerActive = true
    }
    clock.countdown(timeLeft, function(event) {
        angular.element(this).html(event.strftime('%M:%S'))
    })

    if ($scope.activeGame.timerActive) {
        clock.countdown('start')
        roundCircleInterval = setInterval(function() {
            roundCircleTime -= 1;
            $scope.circle.set(parseInt(roundCircleTime / 120 * 100));
        }, 1000)
    } else clock.countdown('stop')

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key]
            return ((x < y) ? 1 : ((x > y) ? -1 : 0))
        })
    }

    function ParseBets(players, items) {
        var BETS = []
        players.forEach(function(player) {
            var BET = {
                owner: player.steamid,
                name: player.nickname,
                avatar: player.avatar,
                items: [],
                bank: 0
            }
            items.forEach(function(item) {
                if (player.steamid == item.owner) {
                    BET.chance = Math.round(player.chance)
                    BET.bank += item.price
                    BET.items.push(item)
                }
            })
            BETS.push(BET)
        })
        return sortByKey(BETS, 'chance')
    }

    function WinnerPopup(chance, winnerAvatar, winnerName, pot) {
        var html = ''
        var phrase = 'выиграл ' + pot + '$ c шансом ' + chance + '%'
        if ($translate.use() != 'ru') phrase = 'won ' + pot + '$ with ' + chance + '% chance'
        html += '<img class="img-circle" src="' + winnerAvatar + '">'
        html += '<p style="font-size:1.2em"><strong class="green">' + winnerName + '</strong> ' + phrase + '</p>'
        angular.element('#alertify').remove()
        alertify.alert(html)
    }

    function AddBetToBets(newBet, pot) {
        var found = false

        $scope.activeGame.bets.forEach(function(bet) {
            if (bet.owner == newBet.owner) {
                found = true

                newBet.items.forEach(function(item) {
                    bet.bank += item.price
                    bet.items.push({
                        icon_url: item.icon_url,
                        title: item.title,
                        price: item.price
                    })
                })

                bet.items = sortByKey(bet.items, 'price')
            }
        })

        if (!found) {
            var bet = {
                owner: newBet.owner,
                name: newBet.owner_name,
                avatar: newBet.owner_avatar_url,
                items: [],
                bank: 0
            }

            newBet.items.forEach(function(item) {
                bet.bank += item.price
                bet.items.push({
                    icon_url: item.icon_url,
                    title: item.market_name,
                    price: item.price
                })
            })

            bet.items = sortByKey(bet.items, 'price')

            $scope.activeGame.bets.push(bet)
        }

        $scope.activeGame.bets.forEach(function(bet) {
            bet.chance = Math.round((bet.bank / pot) * 100)
        })
    }

    $scope.$watch('activeGame.state', function(newVal) {
        if ($translate.use() == 'ru') {
            switch (newVal) {
                case 'live':
                    $scope.activeGame.stateDesc = 'Ставки принимаются';
                    break
                case 'frozen':
                    $scope.activeGame.stateDesc = 'Раунд завершается';
                    break
                case 'finished':
                    $scope.activeGame.stateDesc = 'Победитель определен';
                    break
            }
        } else {
            switch (newVal) {
                case 'live':
                    $scope.activeGame.stateDesc = 'Accepting bets';
                    break
                case 'frozen':
                    $scope.activeGame.stateDesc = 'Round frozen';
                    break
                case 'finished':
                    $scope.activeGame.stateDesc = 'The winner determined';
                    break
            }
        }
    })

    $rootScope.$on('CGW_TOTALONLINE', function(event, data) {
        $scope.$apply(() => {
            $rootScope.stats.usersOnline = data.online
        })
    })

    $rootScope.$on('CGW_UPDATES', function(event, data) {
        if (data.event == 'NEW_BET') {
            $scope.activeGame.pot = data.pot
            document.title = "Winner [" + Math.ceil(data.pot) + "$]";
            $scope.activeGame.itemCount += data.bet.items.length
            AddBetToBets(data.bet, data.pot)
            $scope.activeGame.bets = sortByKey($scope.activeGame.bets, 'chance')
            $scope.$apply(function() {
                $scope.bar.set($scope.activeGame.itemCount * 2);
                $scope.circle.set('value', $scope.activeGame.itemCount / 50)
                playSound('bet')
                if (!$scope.activeGame.timerActive && $scope.activeGame.bets.length > 1) {
                    roundCircleTime = roundTimeout / 1000
                    roundCircleInterval = setInterval(() => {
                        roundCircleTime -= 1;
                        $scope.circle.set(parseInt(roundCircleTime / 120 * 100))
                    }, 1000)
                    clock.countdown(Date.now() + roundTimeout, function(event) {
                        angular.element(this).html(event.strftime('%M:%S'))
                    }).countdown('start')
                    $scope.activeGame.timerActive = true
                }
            })
        } else if (data.event == 'ROUND_FROZEN') {
            roundCircleTime = 120;
            $scope.circle.set(0)
            clearInterval(roundCircleInterval)
            $scope.activeGame.state = 'frozen'
            $scope.$apply()
            clock.countdown(Date.now())
            playSound('preCarousel')
        } else if (data.event == 'ROUND_LIVE') {
            angular.element('.border-carousel').css('display', 'none')
            $scope.activeGame.round = data.id
            $scope.activeGame.state = 'live'
            $scope.activeGame.pot = 0
            $scope.activeGame.itemCount = 0
            $scope.activeGame.timerActive = false
            $scope.activeGame.bets = []
            $scope.$apply(function() {
                $scope.bar.set($scope.activeGame.itemCount * 2);
                $scope.circle.set('value', $scope.activeGame.itemCount)
                clock.countdown(Date.now() + roundTimeout, function(event) {
                    angular.element(this).html(event.strftime('%M:%S'))
                })
                clock.countdown('stop')
            })
        } else if (data.event == 'ROUND_FINISHED') {
            $scope.activeGame.state = 'finished'
            clearInterval(roundCircleInterval)
            playSound('winner')
            $scope.$apply(function() {
                var users = data.players.map(function(x) {
                    return {
                        name: x.nickname,
                        image: x.avatar,
                        luck: 0
                    };
                });
                var winner = {
                    name: data.winner.nickname,
                    image: data.winner.avatar,
                    luck: Math.round(data.winner.chance)
                };
                $scope.roulette.fill(users, winner, data.jackpot)
                $scope.roulette.roll()
                setTimeout(() => addWinner({
                    user: data.winner.nickname,
                    image: data.winner.avatar,
                    summ: data.jackpot.toFixed(2),
                    luck: winner.luck
                }), 5000)
                setTimeout(() => {
                    $scope.roulette.clear()
                    roundCircleTime = 120
                    $scope.circle.set(100)
                    $scope.bar.clear()
                }, 10000);
                document.title = "CSGOX.NET [0$]"
            })
        }
    })

    $scope.activeGame.round = roundDesc.round.id
    $scope.activeGame.state = roundDesc.round.state

    $scope.activeGame.pot = roundDesc.round.pot
    document.title = "CSGOX.NET [" + roundDesc.round.pot.split('.')[0] + "$]";
    $scope.activeGame.itemCount = roundDesc.round.items.length
    $scope.whoami.refsCount = roundDesc.stats.userRefsCount || 0
    $scope.stats.largestPot = roundDesc.stats.largestPot
    $scope.stats.recentWinner = roundDesc.stats.recentWinner
    $scope.activeGame.bets = ParseBets(roundDesc.round.players, roundDesc.round.items)
    $rootScope.stats = {
        largestPot: roundDesc.stats.largestPot,
        usersOnline: roundDesc.stats.usersOnline
    }
    $rootScope.showContent = true
    $(".chat_form_input").ready(function() {
        var a = initdata();
        a.bar.set(roundDesc.round.items.length * 2);
        $scope.bar = a.bar;
        $scope.circle = a.circle;
        $scope.roulette = a.roulette;
        $scope.chat = a.chat;
        $scope.circle.set(parseInt(roundCircleTime / 120 * 100));
    })

    $.get("/ajax/lastwinners", function(lastwinners) {
        $scope.lastWinners = lastwinners;
        $scope.$apply(function() {
            console.log('gg');
        });
    })
})

Object.defineProperty(Array.prototype, 'chunk', {
    value: function(n) {
        return Array.from(Array(Math.ceil(this.length / n)), (_, i) => this.slice(i * n, i * n + n));
    }
});

Array.prototype.pushUnique = function(item) {
    if (this.indexOf(item) == -1) {
        this.push(item);
        return true;
    }
    return false;
}

mod.controller('InventoryCtrl', function($scope, $rootScope, $translate) {
    var curIndex = 0;
    var itemsAll = [];
    var deposit = {
        items: [],
        clear: function() {
            deposit.items = []
            $(".inventory_content_list_item").removeClass('selected')
        },
        proceed: function() {
            if (deposit.items.length == 0)
                alertify.error($rootScope.parseNotificationCode('DECLINE_11'), 1500)
            else
                $.post('/ajax/deposit/', {
                    'items': deposit.items,
                    '_csrf': csrf_token
                }, data => {
                    if (data.status == 'success') {
                        alertify.success($rootScope.parseNotificationCode('ACCEPT_1'), 1500)
                        $('.inventory_content_list_item.selected').remove()
                        deposit.clear()
                    } else
                        alertify.error($rootScope.parseNotificationCode(data.error), 1500)
                })
        }
    };
    var clr = function() {
        $(".inventory_content_list_item").each(function(x) {
            this.remove();
        })
    }
    $(".inventory_content_pag_item-arrow").click(function() {
        var next = $(this).attr('next');
        if (next)
            if (curIndex == (itemsAll.length - 1)) return;
        if (!next)
            if (curIndex == 0) return;
        clr();
        curIndex += $(this).attr('next') ? 1 : -1;
        $scope.items = itemsAll[curIndex];

        $scope.$apply()
    });

    $scope.addToCart = function(assetid, event) {
        if ($(event.target).parent().hasClass('selected')) {
            deposit.items.splice(deposit.items.indexOf(assetid), 1)
            $(event.target).parent().removeClass('selected')
        } else {
            if (deposit.items.length == 10) {
                event.preventDefault()
                return alert('Нельзя выбрать более 10 предметов.')
            }
            $(event.target).parent().addClass('selected')
            deposit.items.pushUnique(assetid)
        }
        $scope.deposit = deposit
    }

    $scope.addToCart = function(assetid, event) {
        if ($(event.target).parent().hasClass('selected')) {
            deposit.items.splice(deposit.items.indexOf(assetid), 1)
            $(event.target).parent().removeClass('selected')
        } else {
            if (deposit.items.length == 10) {
                event.preventDefault()
                return alert('Нельзя выбрать более 10 предметов.')
            }
            $(event.target).parent().addClass('selected')
            deposit.items.pushUnique(assetid)
        }
        $scope.deposit = deposit
    }

    try {
      inventoryCache = JSON.parse(localStorage.getItem('inventoryCache'))
    }catch(e){
      inventoryCache = null
    }
    if (inventoryCache != null && ((Date.now() - inventoryCache.updated) <= 15000)) {
        console.log('Inventory loaded from local cache')
        itemsAll = inventoryCache.inventory
        $scope.items = itemsAll[curIndex]
        $scope.sum = inventoryCache.sum
        $rootScope.showInventory = true
    } else {
      $.get("/ajax/inventory").then(function(inventory) {
          console.log('Inventory loaded from backend')
          inventory = inventory.sort(function(a, b) {
              return b.price - a.price;
          });
          itemsAll = inventory.chunk(9)
          $scope.items = itemsAll[curIndex]
          $scope.sum = parseFloat(inventory.reduce(function(a, b) {
              return a + b.price;
          }, 0))
          $rootScope.showInventory = true
          localStorage.setItem('inventoryCache', JSON.stringify({'updated': Date.now(), 'inventory': itemsAll, 'sum': $scope.sum}))
      })
    }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('.inventory_content_list_item').each(function(x) {
            if (deposit.items.indexOf($(this).attr("assetid")) != -1) {
                $(this).addClass('selected')
            }
        })
    });
});
mod.controller('ChatCtrl', function($scope, $rootScope, $translate) {

    var $datEmoji = $('.chat_form_emoji_list_item');

    $datEmoji.click(function(event) {
        event.preventDefault();
        var emojicode = $(this)[0].children[0].src.match(/([a-z]+).png/);
        emojicode = ' :' + emojicode[1] + ': '
        $scope.chatDraft = $scope.chatDraft + emojicode;
        $('.chat_form_input').focus();
        $scope.$apply();
    })


    $scope.messages = []
    $scope.chatDraft = ''
    $scope.chatBlock = false
    var noAutoScroll = false

    var chatBlock = angular.element('.chat_content')
    /*chatBlock.niceScroll({
        cursorborder: 'none',
        cursorcolor: '#6CE12C',
        mousescrollstep: 48,
        horizrailenabled: false,
        cursoropacitymax: 0
    })

    var chatScroll = chatBlock.getNiceScroll(0)
    chatBlock.bind('scroll', function() {
        if (chatScroll.scrollvaluemax > chatScroll.scroll.y + 32) noAutoScroll = true
        else noAutoScroll = false
    })*/

    $rootScope.$on('CGW_CHAT', function(event, data) {
        $scope.$apply(function() {
            var findEmoji = /:([^\s]+):/g;
            var result = data.text.match(findEmoji);
            $rootScope.emoji = function(text) {
                var allowed = ["clever", "cloud", "down", "fun", "light", "money", "navi", "oh", "sad", "shot", "smile", "up", "zzz"];
                return text.replace(findEmoji, function(match, text, urlId) {
                    var emoji = match.split(':')[1];
                    if (allowed.indexOf(emoji) == -1) {
                        return '';
                    }
                    return "<img src='/img/emoji/" + emoji + ".png' class='emojiInChat'>";
                });
            }
            $scope.messages.push(data)
            if ($scope.messages.length > 64) $scope.messages.splice(0, 1)
            //chatScroll.resize()
            setTimeout(function() {
                if (noAutoScroll) return
                //chatScroll.doScrollTop(100000, 1000)
                $(".chat_content").animate({
                    scrollTop: $(".chat_content")[0].scrollHeight
                }, (228 + 322));
            }, 50)
        })
    })

    $scope.BanUser = function(data) {
        if ($rootScope.admins.indexOf($rootScope.whoami.steamID) == -1) return
        var targetSteamID = data.msg.steamID
        if ($rootScope.admins.indexOf(targetSteamID) != -1) return
        alertify.confirm('Уверен, что хочешь забанить пользователя ' + targetSteamID + ' ?', function(e) {
            if (!e) return
            $rootScope.socket.emit('CGWA_ChatBan', targetSteamID, function(err) {
                if (err) return alertify.log(err, 'error', 2500)
                alertify.log('Пользователь ' + targetSteamID + ' забанен', 'success', 2500)
            })
        })

    }

    $scope.SendChatMsg = function() {

        if (!$scope.chatDraft) return
        if ($scope.chatBlock) {
            $scope.chatDraft = '';
            return
        }
        $scope.chatBlock = true
        setTimeout(function() {
            $scope.chatBlock = false
        }, 2000)
        var msg = {
            avatar: $scope.whoami.avatar,
            name: $scope.whoami.name,
            steamID: $scope.whoami.steamID,
            text: $scope.chatDraft,
        }
        if ((msg.name == 'ADMIN') || (msg.text.indexOf('заходите') > -1)) return

        $rootScope.chatChannel.emit('message', {
            'event': 'send',
            'lang': $translate.use(),
            'message': msg
        })

        $scope.chatDraft = ''
    }

})
