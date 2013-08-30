app.directive('taglist', ['$location', function($location) {
  return {
    restrict: 'E',
    templateUrl: 'assets/directives/taglist.html',
    scope: { 
      tags: '=',
      limit: '@',
      path: '@'
    },
    link: function(scope) {
      scope.limitedTags = scope.limit ? scope.tags.slice(0, scope.limit) : scope.tags;
      scope.wasLimited = scope.limit && scope.tags.length > scope.limit
      scope.searchTags = function($event, tag) {
        $event.stopPropagation()
        if (scope.path) {
          $location.path(scope.path).search('tag', tag);
        }
      }
    }
  }
}]);