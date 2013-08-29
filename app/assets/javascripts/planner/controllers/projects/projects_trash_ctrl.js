app.controller('ProjectsTrashCtrl', ['$scope', 'ProjectService', function($scope, ProjectService) {
  $scope.projects = ProjectService.query({ trashed: true })
}]);