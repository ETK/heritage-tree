app.config(function ($stateProvider) {
  $stateProvider.state('milestones', {
    url: '/milestones',
    templateUrl: 'components/milestones/index.html',
    controller: 'MilestonesController',
    resolve: {
      milestones: function(MilestoneFactory) {
        return MilestoneFactory.fetchAll();
      },
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false });
      }
    }
  });
});
