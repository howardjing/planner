app.controller('BreadcrumbsCtrl', ['$scope', 'Breadcrumb', function($scope, Breadcrumb) {
  
  $scope.$watch(function() { return Breadcrumb.crumbs.currentCrumb }, function(crumb) {
    $scope.breadcrumbs = Breadcrumb.getCrumbs();
  });

  $scope.isActive = Breadcrumb.isActive;
}]);