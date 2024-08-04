var app = angular.module('app', ['ngRoute', 'pascalprecht.translate', 'ngAnimate', 'game', 'rating', 'history', 'ngSanitize'])

app.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.config(function($httpProvider, $routeProvider, $translateProvider) {

    $httpProvider.defaults.xsrfCookieName = 'sid'
    $routeProvider

        .when('/', {
            templateUrl: '/views/game.html',
            controller: 'GameCtrl',
            resolve: {
                roundDescObj: function($http) {
                    return $http.get('/ajax/game')
                        .success(function(data) {
                            return data
                        })
                }
            }
        })

        .when('/rating', {
            templateUrl: '/views/rating.html',
            controller: 'RatingCtrl',
            resolve: {
                ratingObj: function($http) {
                    return $http.get('/ajax/rating')
                        .success(function(data) {
                            console.log(data);
                            return data;
                        })
                },
            }
        })

        .when('/weekContest', {
            templateUrl: '/views/week.html',
            controller: 'WeekCtrl'
        })

        .when('/settings', {
            templateUrl: '/views/settings.html',
            controller: 'SettingsCtrl'
        })

        .when('/howtoplay', {
            templateUrl: '/views/howtoplay.html',
            controller: 'RulesCtrl'
        })

        .when('/lottery', {
            templateUrl: '/views/lottery.html',
            controller: 'LotteryCtrl',
            resolve: {
                lottery: function($http) {
                    return $http.get('/ajax/lottery')
                        .success(function(data) {
                            console.log(data);
                            return data;
                        })
                },
            }
        })

        .when('/history', {
            templateUrl: '/views/history.html',
            controller: 'HistoryCtrl',
            resolve: {
                historyObj: function($http) {
                    return $http.get('/ajax/history')
                        .success(function(data) {
                            return data
                        })
                }
            }
        })

        .when('/rules', {
            templateUrl: '/views/rules.html',
            controller: 'RulesCtrl'
        })

        .when('/invite', {
            templateUrl: '/views/invite.html',
            controller: 'InviteCtrl'
        })

        .otherwise({
            redirectTo: '/'
        })

    $translateProvider

        .translations('en', {

            HEADER_signIn: 'Sign in through Steam',
            HEADER_settings: 'Settings',
            HEADER_offSound: 'Turn off the sound',
            HEADER_onSound: 'Turn on the sound',
            SOUND_turnedOff: 'Sounds turned off',
            SOUND_turnedOn: 'Sounds turned on',
            HEADER_inventory: 'Inventory',
            HEADER_inventory_total: 'Total',
            HEADER_inventory_bet: 'Make bet',
            HEADER_inventory_cancel: 'Cancel',
            HEADER_chat: 'Chat',
            HEADER_chat_write: 'Write a message...',

            SETTINGS_ENTERLINK: 'Enter your Steam tradelink and press Enter',
            SETTINGS_GETLINK: '(get link)',

            MENU_LOTTERY: 'Lottery',
            MENU_PLAY: 'Play',
            MENU_COINFLIP: 'Coinflip',
            MENU_HISTORY: 'History',
            MENU_RULES: 'Rules',
            MENU_RATING: 'Rating',
            MENU_HOWTOPLAY: 'How to play?',
            MENU_SUPPORT: 'Support EMail',
            MENU_DONATE: 'Donate to project',

            GAME_largestBank: 'Largest jackpot',
            GAME_usersOnline: 'Players online',
            GAME_round: 'Round',
            GAME_bank: 'Game bank',
            GAME_timeToEnd: 'Time to end',
            GAME_itemsInGame: 'Items in game',
            GAME_winnersInRealTime: 'Winners in real time',
            GAME_feed_gameStarted: 'Game started, bet your items!',
            GAME_placed_item: 'placed',
            GAME_items: 'items',

            RATING_header: 'Rating',
            RATING_place: 'Place',
            RATING_nickname: 'Nickname',
            RATING_winCount: 'Rounds won',
            RATING_earned: 'Earned',

            HISTORY_header: 'History',
            HISTORY_playerwon: 'won',

            RULES_aboutGameProcess: 'Briefly about game process',
            RULES_bagp1: 'Players are laying out the items in a current round;',
            RULES_bagp2: 'When round time is up to the end or items quantity is neat to it\'s maximum, then the round will be frozen till the latest bets will be proceed;',
            RULES_bagp3: 'If all bets were proceed - system determines a winner, which gets all round items except of project commission;',
            RULES_bagp4: 'The new round is beginning.',
            RULES_howToParticipate: 'How to take part',
            RULES_htp1: '<a href="/auth/steam_ru">Sign in</a> with Steam OpenID;',
            RULES_htp2: 'Use <a href="http://steamcommunity.com/id/me/edit/settings" target="_blank">privacy settings</a> on Steam website to make your inventory open and get opportunity to stake;',
            RULES_htp3: 'Copy your <a href="http://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank">trade URL</a> and save it on csgowiner.net to receive your winnings. After saving your link is transforming into token automatically;',
            RULES_htp4: '<a href="#/">Gamble</a>, risk and <a href="#rating">win!</a>',
            RULES_details: 'System peculiarities and limitations',
            RULES_d1: 'Maximum items quantity - 50/round. But could be more items in some cases;',
            RULES_d2: 'Round duration - 3 minutes from the moment, when second player has taken part in current game;',
            RULES_d3: 'Maximum item quantity - 10/bet;',
            RULES_d4: 'Maximum item quantity for one player - 10/round;',
            RULES_d5: 'Minimum total items value - 1$/bet;',
            RULES_d6: 'Trading bot estimates the items value by median price of Steam Market;',
            RULES_d7: 'Trading bot will decline bets that do not meet requirements;',
            RULES_d8: 'If Steam bans our bot, we couldn\'t return player\'s bets.',
            RULES_d9: 'The Loot will be sent to the winner automatically during 2 minutes from the moment of round ending;',

            /* INACTIVE */
            EARN_header: 'Invite friends and earn money',
            EARN_competitionInfo: 'Competition info',
            EARN_howToInvite: 'How to invite friends',
            EARN_compInfo1: 'To win the prize you have to invite users to <a href="#/">csgowinner.net;</a>',
            EARN_compInfo2: 'At the end of the competition five leaders of referral <a href="#rating">rating</a> will be awarded;',
            EARN_compInfo3: 'Only new, unregistered users will be treated as your referrals;',
            EARN_compInfo4: 'Competitions ends on September 1st, 2015.',
            EARN_invite1: '<a href="/auth/steam_en">Sign In</a> with Steam OpenID;',
            EARN_invite2: 'Copy your referral URL at <a href="/#/">home page</a> and give it to your friends;',
            EARN_invite3: 'After using referral URL your friend must <a href="/auth/steam_en">sign in</a> with Steam OpenID as well to be treated as your referral;',
            EARN_invite4: 'Referral <a href="#rating">rating</a> updates at the end of every round.',
            EARN_place1: '1st place',
            EARN_place2: '2nd place',
            EARN_place3: '3rd place',
            EARN_place4: '4th place',
            EARN_place5: '5th place',
            EARN_compEnd: 'Competition ends in',
            EARN_days1: 'day',
            EARN_days2: 'days',
            EARN_days3: 'days',

            WEEK_ABOUT: 'Learn more',
            WEEK_GOGO: 'Become most active player of the week',
            WEEK_header: 'Most active player of the week',
            WEEK_info1: 'Every week we reward the most active player.',
            WEEK_info2: 'Results be fixed at the end of sunday',
            WEEK_info3: 'New week - new prize.',
            WEEK_howto1: 'Simply play on our site.',
            WEEK_howto2: 'Rating with five most active players you can check <a href="#/rating#weekActivity">here</a>.',
            WEEK_howto3: 'The rating counting all games ',
            WEEK_curprize: 'Prize of current week:',

            LOTTERY_TITLE: 'Lottery',
            LOTTERY_JOIN: 'Join',
            LOTTERY_ABOUT: 'About',
            LOTTERY_ABOUT1: 'Everyone can bet any key (1 or more) to join the lottery.',
            LOTTERY_ABOUT2: 'You can bet any number of keys.',
            LOTTERY_ABOUT3: 'Each key increases your chances of winning.',
            LOTTERY_ABOUT4: 'Deciding the winner going on this page at the expiration of a timer.',
            LOTTERY_IN: 'You joined the lottery',
            LOTTERY_NOT_IN: 'You arent joined the lottery',
            LOTTERY_BET: 'Your bet',
            LOTTERY_USERS_IN: 'Number of participants',
            LOTTERY_TIMER: 'Lottery ends in',
            LOTTERY_PRIZE: 'Prize',
            LOTTERY_MAKE_BET: 'Deposit keys',

        })

        .translations('ru', {

            HEADER_signIn: 'Войти через Steam',
            HEADER_settings: 'Настройки',
            HEADER_offSound: 'Выключить звук',
            HEADER_onSound: 'Включить звук',
            SOUND_turnedOff: 'Звуки выключены',
            SOUND_turnedOn: 'Звуки включены',
            HEADER_inventory: 'Инвентарь',
            HEADER_inventory_total: 'Итого',
            HEADER_inventory_bet: 'Сделать ставку',
            HEADER_inventory_cancel: 'Отмена',
            HEADER_chat: 'Чат',
            HEADER_chat_write: 'Напишите сообщение...',

            SETTINGS_ENTERLINK: 'Введите ссылку на обмен Steam и нажмите Enter',
            SETTINGS_GETLINK: '(узнать ссылку)',

            MENU_LOTTERY: 'Лотерея',
            MENU_PLAY: 'Играть',
            MENU_COINFLIP: 'Коинфлип',
            MENU_HISTORY: 'История',
            MENU_RULES: 'Правила',
            MENU_RATING: 'Рейтинг',
            MENU_HOWTOPLAY: 'Как играть?',
            MENU_SUPPORT: 'Написать EMail',
            MENU_DONATE: 'Донат проекту',

            GAME_largestBank: 'Крупнейший банк',
            GAME_usersOnline: 'Игроков онлайн',
            GAME_round: 'Раунд',
            GAME_bank: 'Банк игры',
            GAME_timeToEnd: 'До начала розыгрыша',
            GAME_itemsInGame: 'Предметов в игре',
            GAME_winnersInRealTime: 'Победители в реальном времени',
            GAME_feed_gameStarted: 'Игра началась, вносите предметы!',
            GAME_placed_item: 'внес',
            GAME_items: 'предметов',

            RATING_header: 'Рейтинг',
            RATING_place: 'Место',
            RATING_nickname: 'Пользователь',
            RATING_winCount: 'Количество побед',
            RATING_earned: 'Заработал',

            HISTORY_header: 'История',
            HISTORY_playerwon: 'выиграл',

            RULES_aboutGameProcess: 'Коротко об игровом процессе',
            RULES_bagp1: 'Игроки вкладывают свои предметы в текущий раунд;',
            RULES_bagp2: 'Когда истекает время раунда или достигается максимальное количество предметов, раунд замораживается в ожидании завершения обработки запоздавших ставок;',
            RULES_bagp3: 'Если все ставки обработаны - определяется победитель, который и получает все предметы раунда за вычетом комиссии проекта;',
            RULES_bagp4: 'Начинается новый раунд.',
            RULES_howToParticipate: 'Как принять участие',
            RULES_htp1: '<a href="/auth/steam_ru">Авторизуйся</a> на сайте с помощью Steam OpenID;',
            RULES_htp2: 'Сделай свой инвентарь публичным в <a href="http://steamcommunity.com/id/me/edit/settings" target="_blank">настройках</a> приватности на сайте Steam, чтобы иметь возможность делать ставки;',
            RULES_htp3: 'Скопируй <a href="http://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank">свою ссылку для обмена</a> и сохрани ее на <a href="#/">csgowinner.ru</a>, чтобы иметь возможность получать выигрыши. После сохранения твоя ссылка автоматически преобразуется в токен;',
            RULES_htp4: '<a href="#/">Делай ставки</a>, рискуй и <a href="#rating">выигрывай!</a>',
            RULES_details: 'Особенности и ограничения системы',
            RULES_d1: 'Максимальное количество предметов в раунде - 50. В некоторых случаях предметов может быть и больше;',
            RULES_d2: 'Продолжительность раунда - 2 минуты с момента вступления второго участника в игру;',
            RULES_d3: 'Максимальное количество предметов в ставке - 10;',
            RULES_d4: 'Максимальное количество предметов на игрока в раунде - 10;',
            RULES_d5: 'Минимальная суммарная стоимость предметов в ставке - 1$;',
            RULES_d6: 'Предметы оцениваются по медианной стоимости, полученной от Steam Market;',
            RULES_d7: 'Ставки, не соответствующие требованиям, а также ставки, сделанные после заморозки и до начала следующего раунда или поступившие от незарегистрированных пользователей будут отклонены торговым ботом;',
            RULES_d8: 'Если Steam забанят нашего бота, мы не сможем вернуть ставки игроков.',
            RULES_d9: 'Выигрыш отправляется победителю автоматически, в течение 2 минут с момента окончания раунда;',

            /* INACTIVE */
            EARN_header: 'Приглашай друзей и зарабатывай',
            EARN_competitionInfo: 'Информация о конкурсе',
            EARN_howToInvite: 'Как приглашать друзей',
            EARN_compInfo1: 'Чтобы бороться за призы нужно приглашать друзей (рефералов) на <a href="#/">csgowinner.ru;</a>',
            EARN_compInfo2: 'По окончанию конкурса пять лидеров реферального <a href="#rating">рейтинга</a> получат денежные призы;',
            EARN_compInfo3: 'Рефералами могут считаться только новые, еще незарегистрированные на сайте пользователи;',
            EARN_compInfo4: 'Итоги конкурса будут подведены 1 сентября 2015 года.',
            EARN_invite1: '<a href="/auth/steam_ru">Авторизуйся</a> на сайте с помощью Steam OpenID;',
            EARN_invite2: 'Скопируй свою реферальную ссылку на <a href="/#/">главной странице</a> сайта и передай её своим друзьям;',
            EARN_invite3: 'После перехода по твоей реферальной ссылке твой друг должен также <a href="/auth/steam_ru">авторизоваться</a> на сайте с помощью Steam OpenID. Тогда он станет твоим рефералом;',
            EARN_invite4: 'Реферальный <a href="#rating">рейтинг</a> обновляется в конце каждого раунда.',
            EARN_place1: '1 место',
            EARN_place2: '2 место',
            EARN_place3: '3 место',
            EARN_place4: '4 место',
            EARN_place5: '5 место',
            EARN_compEnd: 'До завершения конкурса осталось',
            EARN_days1: 'день',
            EARN_days2: 'дней',
            EARN_days3: 'дня',

            WEEK_header: 'Самый активный игрок недели',
            WEEK_info1: 'Каждую неделю мы награждаем самого активного игрока.',
            WEEK_info2: 'Итоги подводятся каждое воскресенье в 23:59 и публикуются в нашем <a href="//vk.com/csgorolly" target="_blank">паблике</a>.',
            WEEK_info3: 'Каждую неделю приз меняется.',
            WEEK_howto1: 'Достаточно просто играть на нашем сайте.',
            WEEK_howto2: 'Актуальный рейтинг с пятью самыми активными игроками можно посмотреть <a href="#/rating#weekActivity">тут</a>.',
            WEEK_howto3: 'В рейтинге учитываются все игры ',
            WEEK_ABOUT: 'Узнать подробности',
            WEEK_GOGO: 'Стань самым активным игроком недели',
            WEEK_curprize: 'Приз текущей недели:',

            LOTTERY_TITLE: 'Лотерея',
            LOTTERY_JOIN: 'Принять участие',
            LOTTERY_ABOUT1: 'Каждый может внести от 1 любого ключа и принять участие в лотерее.',
            LOTTERY_ABOUT2: 'Можно внести любое количество ключей.',
            LOTTERY_ABOUT3: 'Каждый внесенный ключ повышает ваши шансы на победу.',
            LOTTERY_ABOUT4: 'Определение победителя происходит на этой странице по истечению таймера.',
            LOTTERY_IN: 'Вы принимаете участие в лотерее',
            LOTTERY_NOT_IN: 'Вы не принимаете участия в лотерее',
            LOTTERY_BET: 'Ваша ставка',
            LOTTERY_USERS_IN: 'Количество участников',
            LOTTERY_TIMER: 'До окончания лотереи',
            LOTTERY_PRIZE: 'Победитель получит',
            LOTTERY_ABOUT: 'Подробности',
            LOTTERY_MAKE_BET: 'Внести ключи'
        })

    $translateProvider.preferredLanguage('en')


})
app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.run(function($rootScope, $location, $translate) {

    $rootScope.admins = ['76561198101187882']
    $rootScope.withoutBlueNickname = []
    $rootScope.showContent = false
    $rootScope.site = $location.host()
    $rootScope.whoami = {
        steamID: null,
        name: null,
        avatar: null,
        tradeToken: null,
        chatBan: false
    }
    $rootScope.tradeTokenTmp = null
    if (localStorage.getItem('translation') == null)
      localStorage.setItem('translation', 'ru')

    $translate.use(localStorage.getItem('translation'))
    /*
      Setup Socket Connection
    */
    $rootScope.socket = ws('', {})

    /*
      Setup Roulette Main Channel
    */
    $rootScope.rouletteChannel = $rootScope.socket.channel('roulette')
    $rootScope.rouletteChannel.connect(() => {
        $rootScope.rouletteChannel.emit('message', {
            'event': 'CGW_WHOAMI'
        })
    })
    $rootScope.rouletteChannel.on('message', function(message) {
        if (message.event == 'CGW_WHOAMI') {
            $rootScope.whoami.steamID = message.steamid
            $rootScope.whoami.avatar = message.avatar_url
            $rootScope.whoami.name = message.nickname
            $rootScope.whoami.tradeToken = message.trade_url
            $rootScope.tradeTokenTmp = message.trade_url
            $rootScope.$apply()
            if ((window.location.hash != "#/settings") && (message.trade_url < 3))
                $(".header_bar_profile_info_btn").click()
        } else
            $rootScope.$emit('CGW_UPDATES', message)
    })

    /*
      Setup Chat Channel
    */
    $rootScope.chatChannel = $rootScope.socket.channel('chat')
    $rootScope.chatChannel.connect(function(error, connected) {
        $rootScope.chatChannel.emit('message', {
            'event': 'setLang',
            'lang': $translate.use()
        })
    })
    $rootScope.chatChannel.on('message', function(message) {
        if (message.event == 'CGW_NOTIFY')
            alertify.log($rootScope.parseNotificationCode(message.message), message.event, 15000)
        else if (message.event == 'CGW_TOTALONLINE')
            $rootScope.$emit('CGW_TOTALONLINE', message)
        else
            $rootScope.$emit('CGW_CHAT', message)
    })

    $rootScope.parseNotificationCode = code => {
        var ret = code

        if ($translate.use() == 'ru') {
            switch (code) {
                case 'DECLINE_1':
                    ret = 'Твоя ставка отклонена, т.к. текущий раунд завершается';
                    break
                case 'DECLINE_2':
                    ret = 'Твоя ставка отклонена, т.к. ты не указал токен для обмена';
                    break
                case 'DECLINE_3':
                    ret = 'Твоя ставка отклонена, т.к. содержит слишком много предметов';
                    break
                case 'DECLINE_4':
                    ret = 'Твоя ставка отклонена, т.к. кол-во предметов превышает лимит для игрока';
                    break
                case 'DECLINE_5':
                    ret = 'Твоя ставка отклонена, т.к. содержит неподдерживаемые предметы';
                    break
                case 'DECLINE_6':
                    ret = 'Твоя ставка отклонена из-за невозможности оценки предметов';
                    break
                case 'DECLINE_7':
                    ret = 'Твоя ставка отклонена из-за недостаточной суммарной стоимости предметов';
                    break
                case 'DECLINE_8':
                    ret = 'Торговому боту не удалось принять твою ставку. Если предметы, тем не менее, исчезли из инвентаря, пожалуйста, напиши об этом в поддержку';
                    break
                case 'DECLINE_9':
                    ret = 'Твоя ставка отклонена, т.к. содержит сувенирные предметы';
                    break
                case 'DECLINE_10':
                    ret = 'Твоя ставка отклонена, т.к. содержит предметы с нестабильной стоимостью';
                    break
                case 'DECLINE_11':
                    ret = 'Вы не выбрали вещи для депозита';
                    break
                case 'ACCEPT_1':
                    ret = 'Предложение обмена успешно отправлено!';
                    break
            }
        } else {
            switch (code) {
                case 'DECLINE_1':
                    ret = 'Your bet declined because round is already frozen';
                    break
                case 'DECLINE_2':
                    ret = 'Your bet declined because you didn\'t specify trade URL;';
                    break
                case 'DECLINE_3':
                    ret = 'Your bet declined because it contains too many items';
                    break
                case 'DECLINE_4':
                    ret = 'Your bet declined because item quantity greater than per player limit';
                    break
                case 'DECLINE_5':
                    ret = 'Your bet declined because it contains unsupported items';
                    break
                case 'DECLINE_6':
                    ret = 'Your bet declined because trading bot failed to estimate items prices';
                    break
                case 'DECLINE_7':
                    ret = 'Your bet declined because total items price in not big enough';
                    break
                case 'DECLINE_8':
                    ret = 'Trading bot failed to process your bet because of STEAM issues. If items disappeared from your inventory, please, notify support team about the issue';
                    break
                case 'DECLINE_9':
                    ret = 'Your bet declined because it contains souvenir items';
                    break
                case 'DECLINE_10':
                    ret = 'Your bet declined because it contains items with unstable price';
                    break
                case 'DECLINE_11':
                    ret = 'You did not choose the items for the deposit';
                    break
                case 'ACCEPT_1':
                    ret = 'Trade offer sent successfully!';
                    break
            }
        }

        return ret
    }

    $rootScope.$on('$routeChangeStart', function(event, next, current) {

    })


})


function initdata() {
    var settings = {
        chat: {
            block: '.chat',
            hidden: false
        },

        inventory: {
            block: '.inventory',
            hidden: false
        },

        gameProgressBar: {
            block: '.game_info_bar'
        },

        gameProgressCircle: {
            block: '.game_status_circle'
        },

        gameBanner: {
            block: '.game_info_banner'
        },

        createBanner: {
            block: '.flip-create_content_banner'
        },

        roulette: {
            block: '.game_status_main_roulette',
            parent: '.game_status_main',
            container: '.game_status'
        },


        duel: {
            block: '.modal-duel'
        },

        historyTabs: {
            block: '.history_title_tabs'
        },

        guideTabs: {
            block: '.guide_title_tabs'
        },

        ratingTabs: {
            block: '.rating_title_tabs'
        }
    };

    var chat = new Window(settings.chat);
    var inventory = new Window(settings.inventory);

    var roulette = new Roulette(settings.roulette);
    var gameProgressCircle = new Circle(settings.gameProgressCircle);
    var gameProgressBar = new Bar(settings.gameProgressBar);

    var gameBanner = new Banner(settings.gameBanner);
    var createBanner = new Banner(settings.createBanner);

    var historyTabs = new Tabs(settings.historyTabs);
    var guideTabs = new Tabs(settings.guideTabs);
    var ratingTabs = new Tabs(settings.ratingTabs);

    return {
        bar: gameProgressBar,
        circle: gameProgressCircle,
        roulette: roulette,
        chat: chat
    };
}
