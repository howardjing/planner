app.controller('ConfirmationModalCtrl', ['$scope', '$modalInstance', 'message', 'yesText', 'noText', 'save', 'state', 
  function($scope, $modalInstance, message, yesText, noText, save, state) {

  $scope.message = message;
  $scope.yesText = yesText;
  $scope.noText = noText;
  $scope.state = state;

  $scope.ok = function() {
    save().$promise.then(function() {
      $modalInstance.close();
    })
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
    state.reset();
  };

}]);