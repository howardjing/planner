app.controller('ProjectsIndexCtrl', ['$scope', '$log', '$modal', 'ProjectService',
function($scope, $log, $modal, ProjectService) {

  $scope.projects = ProjectService.query();
  $scope.newProject = {};
  $scope.state = ProjectService.getState();

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
            var saving = ProjectService.save(newProject)
            saving.$then(function(response) {
              $scope.projects.unshift(response.data);
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