app.controller('TasksFormCtrl', ['$scope', '$modalInstance', 'task', 'save', 'state', 'TagsService',
function($scope, $modalInstance, task, save, state, TagsService) {
  
  $scope.task = angular.copy(task);
  $scope.state = state;

  $scope.ok = function() {
    save($scope.task).$promise.then(function() {
      $modalInstance.close($scope.task);
    })
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    state.reset();
  };

  $scope.findTags = function(search, results) {
    TagsService.query({search: search}).success(function(data) {
      results.data = data;
    });
  }
}]);