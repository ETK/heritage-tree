app.directive('navbar', function (PeopleFactory, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'common/navbar/navbar.html',
    link: function (scope) {

      PeopleFactory.fetchAll({ includeRelations: false })
      .then(people => scope.people = people);

      scope.items = [
        { label: 'Home', state: 'home' },
        { label: 'People', state: 'people' },
        { label: 'Milestones', state: 'milestones' },
        { label: 'Force Chart', state: 'forceChart' },
        { label: 'Ancestor Tree Chart', state: 'ancestorTreeChart' },
        { label: 'Descendant Tree Chart', state: 'descendantTreeChart' },
      ];

    }

  };

});
