// Sign in stuff
app.factory('SigninInterceptor', ['$q', '$location', 'AfterSignin', function($q, $location, AfterSignin) {    
  return {
    response: function(response) {
      return response;
    },
    responseError: function(response) {
      if (response.status == 401) {
        AfterSignin.path($location.path());
        $location.path('/signin');
      }
      return $q.reject(response);
    }
  }
}]);

app.factory('AfterSignin', [function() {
  
  var pathAfterSignin = "/";

  // return the path after signin then reset to "/"
  var getPath = function() {
    return pathAfterSignin;
  }

  // set the path after signin
  var setPath = function(path) {
    pathAfterSignin = path;
  }

  return {
    // path() will return getPath();
    // path('/thing') will set the after signin path to '/thing'
    path: function() {
      if (arguments.length == 0) {
        var path = getPath();
        setPath("/");
        return path;
      } else if (arguments.length == 1) {
        return setPath(arguments[0]);
      }
    }
  }
}]);