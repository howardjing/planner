app.factory('StateSynchronizer', function() {
  function State() {
    this.reset();
  };

  State.prototype.reset = function() {
    this.context = '';
    this.errors = [];
  }

  State.prototype.syncing = function() {
    this.context = 'syncing...';
  }

  State.prototype.isSyncing = function() {
    return this.context === 'syncing...';
  }

  State.prototype.success = function() {
    this.context = 'success.' 
  }

  State.prototype.failure = function(errors) {
    this.context = 'failure.';
    this.errors = errors;
  }

  return {
    create: function() { 
      return new State(); 
    }
  }
})