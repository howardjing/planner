app.controller('BreadcrumbsCtrl', ['$scope', 'Breadcrumb', function($scope, Breadcrumb) {
  
  $scope.$on('$routeChangeSuccess', function() {
    $scope.breadcrumbs = Breadcrumb.getCrumbs();
  })

  $scope.isActive = Breadcrumb.isActive;
}]);