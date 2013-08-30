app.controller('ProjectsShowCtrl', ['$scope', '$log', '$modal', '$location', 'ProjectService', 'TaskService', 'project',
function($scope, $log, $modal, $location, ProjectService, TaskService, project) {

  $scope.project = project;
  $scope.projectState = ProjectService.getState();
  
  $scope.tasks = project.tasks;
  $scope.newTask = {};
  $scope.taskState = TaskService.getState();

  $scope.$watch(function() { return $location.search().tag }, function(tag) {
    $scope.tag = tag;
  })
  $scope.$watch('tag', function(tag) {
    if (tag) {
      $location.search('tag', tag)
    } else {
      $location.search('tag', null)
    }
  })

  $scope.clearTag = function() {
    $scope.tag = '';
  }

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

  $scope.deleteProject = function() {
    $modal.open({
      templateUrl: 'assets/directives/confirmation_modal.html',
      controller: 'ConfirmationModalCtrl',
      resolve: {
        message: function() {
          return "Are you sure you want to delete " + $scope.project.title + "?"
        },
        yesText: function() {
          return "Yes, delete it."
        },
        noText: function() {
          return "No, don't delete it."
        },
        save: function() {
          return function() {
            var saving = ProjectService.delete({ id: $scope.project.id })
            saving.$then(function(response) {
              $location.path('/');
            });
            return saving;
          }
        },
        state: function() {
          return $scope.projectState;
        }
      }
    })
  }

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