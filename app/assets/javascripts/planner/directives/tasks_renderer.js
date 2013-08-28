app.directive('tasksRenderer', ['$location', function($location) {
  return {
    restrict: 'E',
    templateUrl: 'assets/directives/tasks_renderer.html',
    scope: {
      project: '=',
      tasks: '='
    },
    link: function(scope) {
      scope.tasksPath = function(project, task) {
        return "projects/" + project.id + "/tasks/" + task.id;
      }

      scope.redirectTo = function(event, path) {
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        console.log('redirecting to '  + path)
        $location.path(path);
      }
    }
  }
}])