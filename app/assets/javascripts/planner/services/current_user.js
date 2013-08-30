app.factory('CurrentUser', ['$cookies', function($cookies) {
  return {
    isSignedin: function() {
      return !!$cookies.username;
    },
    username: function() {
      return $cookies.username;
    }
  }
}]);