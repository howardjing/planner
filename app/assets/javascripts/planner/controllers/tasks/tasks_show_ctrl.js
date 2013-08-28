app.controller('TasksShowCtrl', ['$scope', '$modal', 'task', 'TaskService', 'StateSynchronizer',
  function($scope, $modal, task, TaskService, StateSynchronizer) {
  
  $scope.task = task;
  $scope.project = task.project;
  $scope.taskFormState = StateSynchronizer.create();
  $scope.taskStatusState = StateSynchronizer.create();

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
            $scope.taskFormState.syncing();
            var saving = TaskService.update({ projectId: $scope.project.id, id: $scope.task.id }, task);
            saving.$then(function(response) {
              $scope.taskFormState.reset();
              $scope.task.title = response.data.title;
              $scope.task.description = response.data.description;
            }, function(response) {
              $scope.taskFormState.failure(response.data.errors);
            });
            return saving;
          }
        },
        state: function() {
          return $scope.taskFormState;
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
    $scope.taskStatusState.syncing();
    TaskService.update({ projectId: $scope.project.id, id: $scope.task.id }, { status: $scope.task.status }) 
      .$then(function(response) {
        $scope.taskStatusState.reset();
        $scope.persistedStatus = response.data.status;
        $scope.task = response.data;
      }, function(response) {
        $scope.taskStatusState.failure(response.data.errors);
      });
  }
}]);