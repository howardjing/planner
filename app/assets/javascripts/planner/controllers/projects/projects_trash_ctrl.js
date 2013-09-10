app.controller('ProjectsTrashCtrl', ['$scope', 'ProjectService', function($scope, ProjectService) {
  $scope.projects = ProjectService.query({ trashed: true })
  $scope.state = ProjectService.getState();
  $scope.currentProject = {};

  $scope.revive = function(project) {
    $scope.currentProject = project;
    ProjectService.update({ id: project.id, action: 'revive' }, {}).$promise.then(function() {
      var index = $scope.projects.indexOf(project);
      $scope.projects.splice(index, 1);
    })
  }
}]);