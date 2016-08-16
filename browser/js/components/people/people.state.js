app.config(function ($stateProvider) {
  $stateProvider.state('people', {
    url: '/people',
    templateUrl: 'views/people/index.html',
    controller: 'PeopleController',
    resolve: {
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false });
      }
    }
  });
});
