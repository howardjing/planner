app.controller('ProjectsShowCtrl', ['$scope', '$log', '$modal', 'ProjectService', 'TaskService', 'StateSynchronizer', 'project',
function($scope, $log, $modal, ProjectService, TaskService, StateSynchronizer, project) {

  $scope.project = project;
  $scope.projectState = StateSynchronizer.create();
  
  $scope.tasks = project.tasks;
  $scope.newTask = {};
  $scope.taskState = StateSynchronizer.create();

  $scope.editProject = function () {
    $modal.open({
      templateUrl: 'assets/views/projects/form.html',
      controller: 'ProjectsFormCtrl',
      resolve: {
        project: function () {
          return $scope.project;
        },
        save: function() {
          return function(project) {
            $scope.projectState.syncing();
            var saving = ProjectService.update({id: project.id}, project)
            saving.$then(function(response) {
              $scope.project = response.data;
              $scope.projectState.success();
            }, function(response) {
              $scope.projectState.failure(response.data.errors);
            });
            return saving;
          }
        },
        state: function() {
          return $scope.projectState;
        }
      }
    });  
  };

  $scope.addNewTask = function() {
    $modal.open({
      templateUrl: 'assets/views/tasks/form.html',
      controller: 'TasksFormCtrl',
      resolve: {
        task: function() {
          return $scope.newTask;
        },
        save: function() {
          return function(newTask) {
            $scope.taskState.syncing();
            var saving = TaskService.save({ projectId: $scope.project.id }, newTask);
            saving.$then(function(response) {
              $scope.tasks.unshift(response.data);
              $scope.taskState.success();
            }, function(response) {
              $scope.taskState.failure(response.data.errors);
            });
            return saving;
          }
        },
        state: function() {
          return $scope.taskState;
        }
      },
    })
  }

}])