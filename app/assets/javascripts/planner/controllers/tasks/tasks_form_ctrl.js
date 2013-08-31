app.controller('TasksFormCtrl', ['$scope', '$modalInstance', 'task', 'save', 'state', 
function($scope, $modalInstance, task, save, state) {
  
  $scope.task = angular.copy(task);
  $scope.state = state;

  $scope.ok = function() {
    save($scope.task).$then(function() {
      $modalInstance.close($scope.task);
    })
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    state.reset();
  };
}]);