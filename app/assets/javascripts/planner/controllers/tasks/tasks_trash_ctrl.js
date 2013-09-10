app.controller('TasksTrashCtrl', ['$scope', 'project', 'TaskService', 
  function($scope, project, TaskService) {
  
  $scope.project = project;
  $scope.tasks = $scope.project.tasks;
  $scope.currentTask = {};
  $scope.state = TaskService.getState();

  $scope.revive = function(task) {
    $scope.currentTask = task;
    TaskService.update({ projectId: $scope.project.id, id: task.id, action: 'revive' }, {})
      .$promise.then(function() {
        var index = $scope.tasks.indexOf(task);
        $scope.tasks.splice(index, 1);
      })
  }
}]);