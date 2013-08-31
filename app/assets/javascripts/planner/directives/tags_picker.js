app.directive('tagsPicker', [function() {
  return {
    restrict: 'E',
    replace: true,
    require: 'ngModel',
    templateUrl: 'assets/directives/tags_picker.html',
    link: function(scope, element, attrs, ngModel) {
      scope.$watchCollection('tags', function(tags) {
        ngModel.$setViewValue(tags);
      })
    },
    controller: ['$scope', '$attrs', '$controller', function($scope, $attrs, $controller) {
      $scope.tags = $scope.$eval($attrs.ngModel) || [];
      $scope.currentTag = '';

      var inArray = function(array, element) {
        return array.indexOf(element) != -1;
      }

      $scope.deleteTag = function(tag) {
        if (inArray($scope.tags, tag)) {
          $scope.tags.splice($scope.tags.indexOf(tag), 1);
        }
      }

      this.createNewTag = function() {
        // don't allow empty tag and don't allow duplicate tags
        if ($scope.currentTag && !inArray($scope.tags, $scope.currentTag)) {
          $scope.tags.push($scope.currentTag);
          $scope.currentTag = '';
        }
      }

      this.isNewTag = function() {
        return $scope.currentTag == '';
      }

      $scope.focused = false;
      
      // so that clicking on this directive will cause the 
      // input text field to also be in focused (don't really like this code)
      $scope.triggerFocus = function() {
        $scope.focused = true;
        $scope.$broadcast('tagsPicker:focused')
      }

      this.isFocused = function() {
        return $scope.focused;
      }

      // angular 1.2 has ng-focus and ng-blur directives, 
      // this function will no longer be necessary at that time
      this.setFocus = function(value) {
        $scope.focused = value;
      }

      this.deleteLastTag = function() {
        if ($scope.tags.length > 0) {
          $scope.tags.pop();
        }
      }
    }]
  }
}]);

app.directive('tagsInput', [function() {

  // entering one of the following keys will make a new tag
  var ENTER = 13;
  var COMMA = 188;

  // pressing this while empty will delete a previous tag
  var DELETE = 8;
  return {
    restrict: 'A',
    require: '^tagsPicker',
    link: function(scope, elem, attrs, tagsPicker) {

      scope.$on('tagsPicker:focused', function() {
        elem[0].focus();
      })
      
      elem.bind('keydown', function(e) {
        if (e.keyCode == ENTER || e.keyCode == COMMA) {
          e.preventDefault();
          scope.$apply(function() {
            tagsPicker.createNewTag();
          });
        }

        if (e.keyCode == DELETE && tagsPicker.isNewTag()) {
          scope.$apply(function() {
            e.preventDefault();
            tagsPicker.deleteLastTag();
          });
        }
      });

      elem.bind('focus', function(e) {
        // will already be applying if this element was focused
        // as a result of the tagsPicker:focused event
        if (!tagsPicker.isFocused()) {
          scope.$apply(function() {
              tagsPicker.setFocus(true);
          })
        }
      });

      elem.bind('blur', function(e) {
        if (tagsPicker.isFocused()) {
          scope.$apply(function() {
            tagsPicker.setFocus(false);
            tagsPicker.createNewTag();
          })
        }
      });
    }
  }
}])