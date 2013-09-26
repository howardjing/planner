(function() {
  // TODO: should probably extract this into a config setting
  var minChars = 2;
  var hasValidTag = function(currentTag) {
    return currentTag && currentTag.length >= minChars;
  };

  angular.module('tagpicker', [])

  // display existing tags and the new tag
  .directive('tagpicker', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: "templates/tagpicker.html",
      scope: {
        tags: '=',
        autocomplete: '&'
      },
      controller: ['$scope', function($scope) {
        var self = this;

        $scope.tags = $scope.tags || [];
        $scope.currentTag = '';
        $scope.focused = false;

        var inArray = function(array, element) {
          return array.indexOf(element) !== -1;
        };

        $scope.deleteTag = function(tag) {
          if (inArray($scope.tags, tag)) {
            $scope.tags.splice($scope.tags.indexOf(tag), 1);
          }
        };

        $scope.triggerFocus = function() {
          self.setFocus(true);
        };

        this.createNewTag = function(newTag) {
          // don't allow empty tag and don't allow duplicate tags
          if (hasValidTag(newTag) && !inArray($scope.tags, newTag)) {
            $scope.tags.push(newTag);
            $scope.currentTag = '';
          }
        };
        $scope.createNewTag = self.createNewTag;

        this.isNewTag = function() {
          return $scope.currentTag === '';
        };

        this.isFocused = function() {
          return $scope.focused;
        };

        this.setFocus = function(value) {
          $scope.focused = value;
        };

        // different from $scope.deleteTag because
        // this will only delete the last tag
        // while deleteTag will search for a tag to delete
        this.deleteLastTag = function() {
          if ($scope.tags.length > 0) {
            $scope.tags.pop();
          }
        };
      }]
    };
  }])

  // internal directive for entering new tag
  .directive('tagInput', [function() {

    // pressing enter or comma will make a new tag
    var ENTER = 13;
    var COMMA = 188;

    // pressing this while empty will delete a previous tag
    var DELETE = 8;

    // clear the current tag input
    var ESCAPE = 27;

    // move between selections
    var UP_ARROW = 38;
    var DOWN_ARROW = 40;

    return {
      restrict: 'A',
      require: ['^tagpicker', '^tagAutocomplete'],
      link: function(scope, elem, attrs, ctrls) {
        var tagpicker = ctrls[0];
        var autocomplete = ctrls[1];

        scope.$watch(function() { 
          return tagpicker.isFocused(); 
        }, function(isFocused) {
          if (isFocused) {
            elem[0].focus();
          }
        });
        
        // should probably just use the ng-keydown directive at this point
        var handleKeydown = function(e, onKeydown) {
          e.preventDefault();
          scope.$apply(onKeydown);
        };

        scope.selectResult = autocomplete.selectResult;
        scope.getSelection = autocomplete.getSelection;

        elem.bind('keydown', function(e) {
          // user wants to create a new tag
          if (e.keyCode === ENTER || e.keyCode === COMMA) {
            handleKeydown(e, function() {
              tagpicker.createNewTag(
                autocomplete.getSelection() || scope.currentTag
              );            
            });
          } 

          // user wants to delete the last tag
          if (e.keyCode === DELETE && tagpicker.isNewTag()) {
            handleKeydown(e, function() {
              tagpicker.deleteLastTag();
            });
          } 

          // user wants to delete the current tag input
          if (e.keyCode === ESCAPE) {
            handleKeydown(e, function() {
              scope.currentTag = '';
            });
          }

          // user wants to select the previous result          
          if (e.keyCode === UP_ARROW) {
            handleKeydown(e, function() {
              autocomplete.selectPrevious();
            });
          } 

          // user wants to select the next result          
          if (e.keyCode === DOWN_ARROW) {
            handleKeydown(e, function() {
              autocomplete.selectNext();
            });
          } 
        });

        elem.bind('focus', function() {
          // will already be applying if this element was focused
          // as a result of the tagpicker:focused event
          if (!tagpicker.isFocused()) {
            scope.$apply(function() {
              tagpicker.setFocus(true);
            });
          }
        });

        elem.bind('blur', function() {
          if (tagpicker.isFocused()) {
            scope.$apply(function() {
              tagpicker.setFocus(false);
              tagpicker.createNewTag(scope.currentTag);
            });
          }
        });
      }
    };
  }])

  // internal directive for handling autocompletion
  .directive('tagAutocomplete', function() {
    return {
      restrict: 'A',
      controller: ['$scope', function(scope) {
        var self = this;
        var hasAutocomplete = !!scope.autocomplete();

        if (hasAutocomplete) {

          scope.results = { data: [] };

          scope.$watch('currentTag', function(value) {
            if (!value) {
              scope.selectedTagIndex = 0;
            }
          });

          // query autocomplete function appropriately
          scope.$watch('currentTag', function(value) {
            if (hasValidTag(value)) {
              scope.autocomplete()(value, scope.results);
            } else {
              scope.results.data = [];
            }
          });

          // insert current user input into results appropriately
          scope.$watchCollection('results.data', function(results) {
            if (hasValidTag(scope.currentTag) && 
              results.indexOf(scope.currentTag) === -1) {
              results.unshift(scope.currentTag);
            }
          });
        }

        // defining controller methods
        if (hasAutocomplete) {
          this.getSelection = function() {
            return scope.results.data[scope.selectedTagIndex];
          };

          this.selectPrevious = function() {
            if (scope.selectedTagIndex > 0) {
              scope.selectedTagIndex -= 1;
            }
          };

          this.selectNext = function() {
            if (scope.selectedTagIndex < scope.results.data.length -1) {
              scope.selectedTagIndex += 1;
            }
          };

          this.selectResult = function(result) {
            scope.selectedTagIndex = scope.results.data.indexOf(result);
          };
        } else { 
          // tagAutocomplete must implement these methods no matter what
          var controllerMethods = ['getSelection', 'selectPrevious', 'selectNext'];
          angular.forEach(controllerMethods, function(method) {
            self[method] = angular.noop;
          });
        }
      }]
    };
  });
})();
