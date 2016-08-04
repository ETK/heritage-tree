app.config(function ($stateProvider) {
  $stateProvider.state('person', {
    url: '/people/:personId',
    templateUrl: 'views/people/person.html',
    controller: 'PersonController',
    resolve: {
      person: function(PeopleFactory, $stateParams) {
        return PeopleFactory.fetchById($stateParams.personId);
      },
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false });
      }
    }
  });
});
