app.service('Breadcrumb', [function() {
  
  // by default be on the home page
  var storage = {
    currentCrumb: 'home',
    resources: {}
  }

  // storing breadcrumbs as a tree
  // not sure how maintainable this will be
  var crumbs = {
    home: { 
      name: function() { 
        return 'home' 
      }, 
      path: function() {
        return '#/'
      },
      parent: null 
    },
    projects: { 
      name: function() { 
        return 'projects' 
      }, 
      path: function() {
        return '#/projects'
      }, 
      parent: 'home' 
    },
    project: { 
      name: function() { 
        // TODO: make this method safer to use (ie resources can be nil, project can be nil, etc.)
        return storage.resources.project.title;
      }, 
      path: function() {
        return '#/projects/' + storage.resources.project.id;
      },
      parent: 'projects'
    },
    task: {
      name: function() {
        return storage.resources.task.title;
      },
      path: function() {
        return '#/projects/' + storage.resources.project.id + '/tasks' + storage.resources.task.id;
      },
      parent: 'project'
    }
  };

  // get the list of crumbs
  var getCrumbs = function(crumb) {
    var list = [];
    var node = crumbs[crumb];
    while (node) {
      list.unshift(node);
      node = crumbs[node.parent];
    }
    return list;
  }

  return {
    // expose the current crumb for watching
    crumbs: storage,

    // retrieve full path to the breadcrumb
    getCrumbs: function() {
      return getCrumbs(storage.currentCrumb);
    },

    // change the current crumb
    // crumb: a string identifying what the active breadcrumb is
    // resources: an object that supplies the necessary data to generate the 
    // name and path of a breadcrumb
    setCrumb: function(crumb, resources) {
      storage.currentCrumb = crumb;
      if (resources) {
        storage.resources = resources;
      }
    },

    // is the given crumb active right now?
    isActive: function(crumb) {
      return crumb == crumbs[storage.currentCrumb];
    }
  }
}]);