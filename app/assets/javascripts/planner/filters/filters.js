app
.filter('humanize', function() {
  return function(text, joiner) {
    if (text) {
      if (!joiner) {
        joiner = " ";
      }
      return text.split("_").join(joiner).toLowerCase();
    }
  }
})

.filter('truncate', function() {
  return function(text, length, end) {
    if (isNaN(length)) {
      length = 50;
    }
    
    if (end === undefined) {
      end = '...';
    }
    
    if (text.length <= length) {
      return text;
    } else {
      return String(text).substring(0, length - end.length) + end;
    }
  }
})