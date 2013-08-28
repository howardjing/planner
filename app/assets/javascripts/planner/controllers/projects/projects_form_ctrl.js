app.controller('ProjectsFormCtrl', ['$scope', '$modalInstance', 'project', 'save', 'state',
function($scope, $modalInstance, project, save, state) {

  $scope.project = angular.extend({}, project);
  $scope.state = state;

  $scope.ok = function() {
    save($scope.project).$then(function() {
      $modalInstance.close($scope.project);
    })
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    state.reset();
  };
  
}]);