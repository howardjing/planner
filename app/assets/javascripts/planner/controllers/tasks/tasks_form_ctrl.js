app.controller('TasksFormCtrl', ['$scope', '$q', '$modalInstance', 'task', 'save', 'state', 'TagsService',
function($scope, $q, $modalInstance, task, save, state, TagsService) {
  
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

  $scope.findTags = function(search) {
    var deferred = $q.defer();
    TagsService.query({search: search})
      .success(function(results) {
        deferred.resolve(results);
      }).error(function(error) {
        deferred.resolve(error);
      });
    return deferred.promise;
  }
}]);