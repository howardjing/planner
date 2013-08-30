// for communicating with backend

// when resource is syncing with server, add some helpful messages / error messages
// right now, the only customizable portion is the url, will add more options as necessary
app.factory('PlannerResource', ['$resource', 'StateSynchronizer', function($resource, StateSynchronizer) {

  // create a resource from $resource with planner specific defaults
  var getResource = function(url) {
    return $resource(url, {}, { update: { method: 'PATCH' }})
  }

  var addStateToResourceMethod = function(resource, method, args, state) {
    state.syncing();
    var synchronizing = resource[method].apply(resource, args);
    synchronizing.$then(function(response) {
      state.reset();
    }, function(response) {
      state.failure(response.data.errors);
    });
    return synchronizing;
  }

  // given a resource and an array of methods, 
  // creates a wrapper object that also responds to that array of methods
  // the wrapper object sets its state to syncing when one of those methods is called 
  // it will remain in the syncing state until the server gives back an answer
  // a getState method is also exposed to check if the resource's syncing status
  var wrapMethods = function(resource, methods) {
    var state = StateSynchronizer.create();

    // the methods that need the synchronizing messages for
    if (!methods) {
      methods = ['query', 'get', 'save', 'update', 'delete'];
    }

    var wrappedResource = {
      getState: function() {
        return state;
      }
    };

    // must define methods within a closure rather than a loop
    angular.forEach(methods, function(method) {
      wrappedResource[method] = function() {
        return addStateToResourceMethod(resource, method, arguments, state);
      }
    });

    return wrappedResource;
  }

  return function(url) {
    var resource = getResource(url);
    return wrapMethods(resource);
  }
}])

app.factory('ProjectService', ['PlannerResource', function(PlannerResource) {
  return PlannerResource('/projects/:id/:action.json');
}])

app.factory('TaskService', ['PlannerResource', function(PlannerResource) {
  return PlannerResource('/projects/:projectId/tasks/:id/:action.json');
}])

app.factory('SessionService', ['PlannerResource', function(PlannerResource) {
  return PlannerResource('/auth/sessions.json');
}]);
  
