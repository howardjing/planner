app.service('Meta', [function() {

  var meta = {
    title: 'Planner'
  }

  return {
    getTitle: function() {
      return meta.title;
    },
    setTitle: function(title) {
      meta.title = title;
    }
  }
}]);