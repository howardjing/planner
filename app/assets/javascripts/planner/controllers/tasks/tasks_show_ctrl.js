app.controller('TasksShowCtrl', ['$scope', '$modal', 'task', 'TaskService',
  function($scope, $modal, task, TaskService) {
  
  $scope.task = task;
  $scope.project = task.project;
  $scope.state = TaskService.getState();

  // should probably fetch this from rails
  $scope.statuses = ['not_started', 'completed']
  $scope.editTask = function() {
    $modal.open({
      templateUrl: 'assets/views/tasks/form.html',
      controller: 'TasksFormCtrl',
      resolve: {
        task: function() {
          return { title: $scope.task.title, description: $scope.task.description };
        },
        save: function() {
          return function(task) {
            var saving = TaskService.update({ projectId: $scope.project.id, id: $scope.task.id }, task);
            saving.$then(function(response) {
              $scope.task.title = response.data.title;
              $scope.task.description = response.data.description;
            });
            return saving;
          }
        },
        state: function() {
          return $scope.state;
        }
      },
    })
  }

  $scope.persistedStatus = task.status;
  $scope.$watchCollection('[task.status, persistedStatus]', function() {
    if ($scope.task.status != $scope.persistedStatus) {
      $scope.statusChanged = true;
    } else {
      $scope.statusChanged = false;
    }
  })

  $scope.saveStatus = function() {
    TaskService.update({ projectId: $scope.project.id, id: $scope.task.id }, { status: $scope.task.status }) 
      .$then(function(response) {
        $scope.persistedStatus = response.data.status;
        $scope.task = response.data;
      });
  }
}]);