app.controller('NavbarCtrl', ['$scope', '$window', 'CurrentUser', 'SessionService', 'AfterSignin',
  function($scope, $window, CurrentUser, SessionService, AfterSignin) {
  
  $scope.user = {};
  $scope.state = SessionService.getState();
  
  $scope.$watch(function() { return CurrentUser.isSignedin() }, function(value) {
    $scope.isSignedin = value;
  });

  $scope.$watch(function() { return CurrentUser.username() }, function(value) {
    $scope.username = value;
  })

  $scope.signin = function() {
    SessionService.save($scope.user).$promise.then(function() {
      $window.location.href = '#!' + AfterSignin.path();
    });
  }

  $scope.signout = function() {
    SessionService.delete().$promise.then(function() {
      $window.location.href = "/";
    });
  }
}]);