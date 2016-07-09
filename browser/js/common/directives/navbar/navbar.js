app.directive('navbar', function ($rootScope) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'views/common/navbar.html',
    link: function (scope) {

      scope.items = [
        { label: 'Home', state: 'home' },
        { label: 'People', state: 'people' },
      ];

    }

  };

});
