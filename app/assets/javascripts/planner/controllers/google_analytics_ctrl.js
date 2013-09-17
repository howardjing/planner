// track page view once a route changes (shoudl probably be a service)
app.controller('GoogleAnalyticsCtrl', ["$scope", "$location", "$window",
  function($scope, $location, $window) {
  $scope.$on('$routeChangeSuccess', function() {
    console.log('setting pageview ' + $location.path());
    $window.ga('send', 'pageview', $location.path());
  });
}])
