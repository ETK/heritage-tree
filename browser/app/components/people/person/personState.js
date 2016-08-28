app.config(function ($stateProvider) {
  $stateProvider.state('person', {
    url: '/people/:personId',
    templateUrl: 'components/people/person/person.html',
    controller: 'PersonController',
    resolve: {
      person: function(PeopleFactory, $stateParams) {
        return PeopleFactory.fetchById($stateParams.personId);
      },
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false });
      },
      milestones: function(MilestoneFactory, $stateParams) {
        return MilestoneFactory.fetchByPersonId($stateParams.personId);
      }
    }
  });
});
