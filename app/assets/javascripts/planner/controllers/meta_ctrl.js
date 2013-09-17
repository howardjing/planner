app.controller('MetaCtrl', ['$scope', 'Meta', function($scope, Meta) {

  $scope.$on('$routeChangeSuccess', function() {
    $scope.title = Meta.getTitle();
    $scope.description = Meta.getDescription();
  });

}]);