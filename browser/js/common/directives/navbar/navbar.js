app.directive('navbar', function (PeopleFactory, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'views/common/navbar.html',
    link: function (scope) {

      PeopleFactory.fetchAll()
      .then(people => scope.people = people);

      scope.items = [
        { label: 'Home', state: 'home' },
        { label: 'People', state: 'people' },
      ];

    }

  };

});
