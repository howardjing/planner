app.controller('ProjectsShowCtrl', ['$scope', '$log', '$modal', 'ProjectService', 'TaskService', 'project',
function($scope, $log, $modal, ProjectService, TaskService, project) {

  $scope.project = project;
  $scope.projectState = ProjectService.getState();
  
  $scope.tasks = project.tasks;
  $scope.newTask = {};
  $scope.taskState = TaskService.getState();

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
            var saving = ProjectService.update({id: project.id}, project)
            saving.$then(function(response) {
              $scope.project = response.data;
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
            var saving = TaskService.save({ projectId: $scope.project.id }, newTask);
            saving.$then(function(response) {
              $scope.tasks.unshift(response.data);
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