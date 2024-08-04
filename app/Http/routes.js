'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/r/:id', function * (request, response) {
  yield request.session.put('referral', request.param('id'))
  response.redirect('/')
})

Route.group('authentication', function () {
  Route.get('/login', 'AuthController.SteamRedirect')
  Route.get('/callback', 'AuthController.SteamCallback')
  Route.get('/logout', 'AuthController.LogOut')
}).prefix('/auth')

Route.group('api', function () {
  Route.post('/updatelink', 'APIController.UpdateLink').middleware('auth')
  Route.post('/deposit', 'APIController.Deposit').middleware('auth')
  Route.get('/inventory', 'AJAXController.Inventory').middleware('auth')
  Route.get('/game', 'AJAXController.Game')
  Route.get('/history', 'AJAXController.History')
  Route.get('/rating', 'AJAXController.Rating')
  Route.get('/lastwinners', 'AJAXController.LastWinners')
}).prefix('/ajax')

Route.group('admin', function () {
  Route.get('/', 'AdminController.index')
  Route.get('/backspin', 'AdminController.backspin')
  Route.get('/rules', 'AdminController.rules')
  Route.post('/foundUser', 'AdminController.foundUser')
  Route.post('/backspin/addWeapon', 'AdminController.addWeapon')
  Route.post('/backspin/setWinner', 'AdminController.setWinner')
  Route.post('/backspin/addChatMessage', 'AdminController.addChatMessage')
  Route.post('/rules/change', 'AdminController.changeUserRule')
}).prefix('/admin').middleware('AdminRights')

Route.get('/test', 'APIController.TestQuery')
