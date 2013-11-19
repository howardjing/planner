app.service('Breadcrumb', ['$location', function($location) {
  
  // by default be on nothing
  var storage = {
    currentCrumb: null,
    resources: {}
  }
  
  var hashBang = '/#!';

  // storing breadcrumbs as a tree
  // not sure how maintainable this will be
  var crumbs = {
    home: { 
      name: function() { 
        return 'home' 
      }, 
      path: function() {
        return '/'
      },
      parent: null 
    },
    signin: {
      name: function() {
        return 'signin'
      },
      path: function() {
        return hashBang + '/signin'
      },
      parent: 'home'
    },
    projects: { 
      name: function() { 
        return 'projects' 
      }, 
      path: function() {
        return hashBang + '/projects'
      }, 
      parent: 'home' 
    },
    projectsTrash: {
      name: function() {
        return 'trash'
      },
      path: function() {
        return hashBang + '/projects/trash'
      },
      parent: 'projects'
    },
    project: { 
      name: function() { 
        // TODO: make this method safer to use (ie resources can be nil, project can be nil, etc.)
        return storage.resources.project.title;
      }, 
      path: function() {
        return hashBang + '/projects/' + storage.resources.project.id;
      },
      parent: 'projects'
    },
    tasksTrash: {
      name: function() {
        return 'trash'
      },
      path: function() {
        return hashBang + '/projects/' + storage.resources.project.id + '/trash';
      },
      parent: 'project'
    },
    task: {
      name: function() {
        return storage.resources.task.title;
      },
      path: function() {
        return hashBang + '/projects/' + storage.resources.project.id + '/tasks' + storage.resources.task.id;
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