'use strict'

const websocket = ws(Config.ws, {});
const client = websocket.channel('admin');

client.connect(function(error, connected) {
  if (error) return;

  client.emit('message', {
    "cmd": "init"
  });
});

const weaponslist = [
  {
    value: 'AWP | Asiimov (Field-Tested)',
    classid: '360484430',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJD_9W7m5a0mvLwOq7cqWdQ-sJ0xOzAot-jiQa3-hBqYzvzLdSVJlQ3NQvR-FfsxL3qh5e7vM6bzSA26Sg8pSGKJUPeNtY',
    avgprice: 35
  },
  {
    value: 'StatTrak™ AK-47 | Fuel Injector (Field-Tested)',
    classid: '2150880360',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhnwMzJemkV08-jhIWZlP_1IbzUklRd4cJ5ntbN9J7yjRrsqkM4ZmqmLILHdQY6aFvW_AC9lO2718S-ucnLwCRnvSN24nmJzEDln1gSOcGSLCO2',
    avgprice: 100
  },
  {
    value: '★ Gut Knife | Fade (Factory New)',
    classid: '312656289',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf1ObcTjxD09q3kIW0m_7zO6_ummpD78A_3OyZrI-n2wPk_RY9NTrwINOSdQc9MlrW_gfqlbu9jJK4uJmYwCBlvT5iuyhGHAgcYg',
    avgprice: 85
  },
  {
    value: '★ Karambit | Doppler (Minimal Wear)',
    classid: '738767148',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRB4MRij7r--YXygECLpxIuNDztJ46SJwdsaFjSqVi3l7i9hJe47p_JzCdkvCMmtHaInhywhxBJbLFvgeveFwvEsgm-vQ',
    avgprice: 360
  },
  {
    value: 'AWP | Hyper Beast (Factory New)',
    classid: '1011969113',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17PLfYQJK9cyzhr-JkvbnJ4Tdn2xZ_Pp9i_vG8MKijFDm_UVvZDz7cIOVIFU_Y1GE-FTrk7q905XpusjNyHJquycq5XeIgVXp1saKgIkM',
    avgprice: 55
  },
  {
    value: 'AWP | Dragon Lore (Field-Tested)',
    classid: '520020768',
    icon_url: 'fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56I_OKMyJYfwHGCKVIXfkF8BrtDig818Z0ROi78r8PPFGA6NOEZOUyMI1KFpaFXPeCZQD76Es-g6FZLZ2NpS67jCrubDgNWBe6rD5QmrWFvKwr3Dj8MQfMIw',
    avgprice: 660
  },
  {
    value: 'M4A4 | Howl (Minimal Wear)',
    classid: '506853400',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwT09S5g4yCmfDLP7LWnn9u5MRjjeyP9tqhiQ2yqEo6Mmn3doPBcwZqZQrRr1O-we_sgMO5tZ_BzCFr6ycltmGdwULa1vGJFg',
    avgprice: 360
  },
  {
    value: 'AWP | Medusa (Minimal Wear)',
    classid: '992830414',
    icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdShR7eO3g5C0m_7zO6_ummpD78A_2rzCo4qgiwLjqkE6MT_0cIaRcAA9Zl3W8gPvw7-9h5PpuJmbm3Jr6T5iuyhpU6MIVQ',
    avgprice: 680
  }
]

function completeSteamProfile(formname) {
  $("#" + formname + " #steamid").autocomplete({
    source: function(request, response) {
      $.post("/admin/foundUser", {
        user: request.term,
        _csrf: csrf_token
      })
      .done(data => {
        if (data.status == 'failed') return response()
        response($.map(data.users, item => {
          return {
            value: item.steamid,
            avatar: item.avatar,
            nickname: item.nickname
          }
        }))
      })
    },
    minLength: 3,
    select: function(event, ui) {
      return true;
    }
  })
  .data("ui-autocomplete")._renderItem = function(ul, item) {
    return $("<li>")
      .data("ui-autocomplete-item", item)
      .append("<img width='32' heigth='32' src='" + item.avatar + "' /><a> " + item.nickname + "</a>")
      .appendTo(ul);
  };
}

function callAPI(formname, method, callback) {
  $("#" + formname + " #submitbtn").click(function() {

    $.post('/admin' + method, $('#' + formname).serialize())
    .done(function(data) {
      if (data.status == 'error')
        data.errors.forEach((item) => {
          addStatusMessage('danger', item.message);
        })
      if (data.status == 'success')
        callback(data)
    })
    .fail(function() {
      addStatusMessage('danger', 'An unknown error occurred during the sending request');
    })

  })
}

function addStatusMessage(status, message) {
  const html = $('<div style="display: none" class="alert bg-' + status + '" role="alert"><svg class="glyph stroked cancel"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#stroked-cancel"></use></svg> ' + message + '<a href="#" class="pull-right"><span class="glyphicon glyphicon-remove"></span></a></div>')
  $('#alerts').append(html);
  html.fadeIn(500)
  setTimeout(() => {
    $(html).fadeOut(500)
  }, 3000)
}

if (window.location.pathname == '/admin/rules') {
  callAPI("changerule_form", "/rules/change", function() {
    addStatusMessage('success', 'User Permissions successfully changed')
  })
}

if (window.location.pathname == '/admin/backspin') {
  completeSteamProfile('fakebet_form')
  completeSteamProfile('chat_form')

  callAPI("chat_form", "/backspin/addChatMessage", function() {
    addStatusMessage('success', 'Message sent successfully!')
  })

  callAPI("winner_form", "/backspin/setWinner", function(data) {
    addStatusMessage('success', 'Winner of this roulette round set to <b>' + data.nickname + '</b> successfully!')
  })

  callAPI("fakebet_form", "/backspin/addWeapon", function() {
    addStatusMessage('success', 'New weapon added to roulette')
  })

  $('#winner_form #round_players').on('click','a',function(e){
    e.stopPropagation();
    $('#winner_form #steamid').val($(this).attr('data-steamid'));
  })

  $("#fakebet_form #marketname").autocomplete({
      source: weaponslist,
      minLength: 1,
      select: function(event, ui) {
        $("#fakebet_form #classid").val(ui.item.classid)
        $("#fakebet_form #icon_url").val(ui.item.icon_url)
        $("#fakebet_form #price").prop('disabled', true).val('Loading price...')

        $.get("http://cors-anywhere.herokuapp.com/steamcommunity.com/market/priceoverview/", {
          country: 'US',
          currency: '1',
          appid: '730',
          market_hash_name: ui.item.value
        })
        .done(function(data) {
          if (data.lowest_price)
            $("#fakebet_form #price").prop('disabled', false).val(data.lowest_price.replace('$', '').replace(',', '.'))
          else
            $("#fakebet_form #price").prop('disabled', false).val('0.00')
        })

        return true
      }
    })
    .data("ui-autocomplete")._renderItem = function(ul, item) {
      return $("<li>")
        .data("ui-autocomplete-item", item)
        .append("<a> " + item.value + "</a> <b>≈" + item.avgprice + "$</b>")
        .appendTo(ul);
    };

  client.on('message', function(message) {
    if (message.cmd == 'round_players') {
      $('#winner_form #round_players').html('<a class="list-group-item btn-default disabled">Select the player from current round</a>')
      message.data.forEach((item) => {
        $('<a data-steamid="' + item.steamid + '" class="list-group-item"><img class="img-circle" width="32" heigth="32" src="' + item.avatar + '"><b style="margin-left: 15px">' + item.nickname + '</b> | ' + item.steamid + '</img></a>').appendTo('#winner_form #round_players')
      })
    }
  });
}

if (window.location.pathname == '/admin/') {
  let lineChartData = {
    type: 'line',
    options: {
      responsive: true,
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            return ' ' + data.datasets[tooltipItems.datasetIndex].label + ': ' + tooltipItems.yLabel + '$';
          }
        }
      },
      legend: {
        display: false
      }
    },
    data: {
      labels: [],
      datasets: [{
        label: "CSGO Inventory",
        backgroundColor: "rgba(48, 164, 255, 0.2)",
        borderColor: "rgba(48, 164, 255, 1)",
        pointBackgroundColor: "rgba(48, 164, 255, 1)",
        pointBorderColor: "#fff",
        data: [],
        spanGaps: true
      }]
    }
  }

  let charts = {
    inventory: $('#status-inventory').easyPieChart({
      scaleColor: false,
      barColor: '#1ebfae',
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent) + "%");
      }
    }),
    cpu: $('#status-cpu').easyPieChart({
      scaleColor: false,
      barColor: '#ffb53e',
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent) + "%");
      }
    }),
    ram: $('#status-ram').easyPieChart({
      scaleColor: false,
      barColor: '#f9243f',
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent) + "%");
      }
    }),
    disk: $('#status-disk').easyPieChart({
      scaleColor: false,
      barColor: '#30a5ff',
      onStep: function(from, to, percent) {
        $(this.el).find('.percent').text(Math.round(percent) + "%");
      }
    }),
    inventory_graph: new Chart(document.getElementById("line-chart").getContext("2d"), lineChartData)
  }

  client.on('message', function(message) {
    if (message.cmd == 'stats_cpu')
      charts.cpu.data('easyPieChart').update(message.data.loadpct)

    if (message.cmd == 'stats_ram')
      charts.ram.data('easyPieChart').update(message.data.usedpct)

    if (message.cmd == 'stats_disk')
      charts.disk.data('easyPieChart').update(message.data.usedpct)

    if (message.cmd == 'stats_inventory') {
      message.data.graph.forEach((item) => {
        charts.inventory_graph.data.datasets[0].data.push(parseInt(item.cost))
        date = new Date(item.date)
        charts.inventory_graph.data.labels.push(date.getHours() + ":" + date.getMinutes())
        charts.inventory_graph.update()
      })
      charts.inventory.data('easyPieChart').update(Math.round(message.data.count * 0.1))
    }
  });
}

$(window).on('resize', function() {
  if ($(window).width() > 768)
    $('#sidebar-collapse').collapse('show')
})
$(window).on('resize', function() {
  if ($(window).width() <= 767)
    $('#sidebar-collapse').collapse('hide')
})
