// for communicating with backend
(function() {

  app.factory('ProjectService', ['$resource', function($resource) {
    return $resource('/projects/:id.json', {}, { update: { method: 'PATCH' } });
  }])

  app.factory('TaskService', ['$resource', function($resource) {
    return $resource('/projects/:projectId/tasks/:id.json', {}, { update: { method: 'PATCH' } });
  }])
  
})();
