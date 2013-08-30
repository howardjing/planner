app.controller('TasksShowCtrl', ['$scope', '$modal', '$location', 'task', 'TaskService',
  function($scope, $modal, $location, task, TaskService) {
  
  $scope.task = task;
  $scope.project = task.project;
  $scope.tags = task.tags;
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

  $scope.deleteTask = function() {
    $modal.open({
      templateUrl: 'assets/directives/confirmation_modal.html',
      controller: 'ConfirmationModalCtrl',
      resolve: {
        message: function() {
          return "Are you sure you want to delete " + $scope.task.title + "?"
        },
        yesText: function() {
          return "Yes, delete it."
        },
        noText: function() {
          return "No, don't delete it."
        },
        save: function() {
          return function() {
            var saving = TaskService.delete({ projectId: $scope.project.id, id: $scope.task.id })
            saving.$then(function(response) {
              $location.path('/projects/' + $scope.project.id);
            });
            return saving;
          }
        },
        state: function() {
          return $scope.state;
        }
      }
    })
  }
}]);