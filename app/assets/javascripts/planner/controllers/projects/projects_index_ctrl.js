app.controller('ProjectsIndexCtrl', ['$scope', '$log', '$modal', 'ProjectService', 'StateSynchronizer',
function($scope, $log, $modal, ProjectService, StateSynchronizer) {

  $scope.projects = ProjectService.query();
  $scope.newProject = {};
  $scope.state = StateSynchronizer.create();

  $scope.addNewProject = function () {
    $modal.open({
      templateUrl: 'assets/views/projects/form.html',
      controller: 'ProjectsFormCtrl',
      resolve: {
        project: function () {
          return $scope.newProject;
        },
        save: function() {
          return function(newProject) {
            $scope.state.syncing();
            var saving = ProjectService.save(newProject)
            saving.$then(function(response) {
              $scope.projects.unshift(response.data);
              $scope.state.success();
            }, function(response) {
              $scope.state.failure(response.data.errors);
            });
            return saving;
          }
        },
        state: function() {
          return $scope.state;
        }
      }
    });
  };
}])