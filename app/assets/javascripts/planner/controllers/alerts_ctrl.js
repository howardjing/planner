app.controller('AlertsCtrl', ['$scope', '$log', 'Alerts', function($scope, $log, Alerts) {
  $scope.$watch(function() { return Alerts.state.loading }, function(loading) {
    $scope.loading = loading;
  })
  $scope.loading = Alerts.isLoading;
}])