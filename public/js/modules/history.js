var mod = angular.module('history', [])

mod.controller('HistoryCtrl', function ($scope, $rootScope, historyObj) {

    $scope.history = historyObj.data
    $rootScope.showContent = true

})