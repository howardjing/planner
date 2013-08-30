app.directive('userRequired', ['CurrentUser', function(CurrentUser) {
  return {
    restrict: 'E',
    templateUrl: 'assets/directives/user_required.html',
    transclude: true,
    link: function(scope) {
      scope.$watch(function() { return CurrentUser.isSignedin() }, function(value) {
        scope.isSignedin = value;
      });
    }
  }
}]);