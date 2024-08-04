var mod = angular.module('rating', [])

mod.controller('RatingCtrl', function ($scope, $rootScope, ratingObj) {

    $scope.rating = ratingObj.data
    $scope.colors = ['#FFEF84', '#FFF7C1', '#FFFBE0', '#E9FAE0', '#F9FEF7']
    $scope.bonus = [500, 300, 100, 75, 25]
    $rootScope.showContent = true

})