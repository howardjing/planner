app.factory('Alerts', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  var state = {};
  var slowlyLoading;

  // enter loading state when route change starts
  $rootScope.$on('$routeChangeStart', function() {
    slowlyLoading = $timeout(function() {
      state.loading = true;
    }, 200);
  })

  var clearLoading = function() {
    state.loading = false;
    if (slowlyLoading) {
      $timeout.cancel(slowlyLoading);
    }
  }
  
  // clear loading sign when route changes
  $rootScope.$on('$routeChangeSuccess', clearLoading);
  $rootScope.$on('$routeChangeError', clearLoading);

  return {
    state: state
  }
}]);