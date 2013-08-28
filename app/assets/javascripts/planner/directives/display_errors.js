app.directive('displayErrors', [function() {
  return {
    restrict: 'E',
    templateUrl: 'assets/directives/display_errors.html',
    scope: {
      errors: '='
    }
  }
}])