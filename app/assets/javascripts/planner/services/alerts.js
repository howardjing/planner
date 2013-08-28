app.factory('Alerts', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var state = {};
  var slowlyLoading;

  // enter loading state when route change starts
  $rootScope.$on('$routeChangeStart', function() {
    slowlyLoading = $timeout(function() {
      state.loading = true;
    }, 200);
  })

  // clear loading sign when route changes
  $rootScope.$on('$routeChangeSuccess', function() {
    state.loading = false;
    if (slowlyLoading) {
      $timeout.cancel(slowlyLoading);
    }
  })

  return {
    state: state
  }
}]);