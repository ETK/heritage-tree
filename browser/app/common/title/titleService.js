app.service('Title', function($rootScope) {
  return {
    setTitle: function(title) {
      $rootScope.page.title = title;
    },
    resetTitle: function() {
      $rootScope.page.title = null;
    }
  }
});
