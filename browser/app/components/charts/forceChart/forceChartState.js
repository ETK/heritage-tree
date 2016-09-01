app.config(function ($stateProvider) {
  $stateProvider.state('forceChart', {
    url: '/charts/force',
    templateUrl: 'components/charts/forceChart/force.html',
    resolve: {
      forceData: function(PeopleFactory, ChartFactory) {
        return PeopleFactory.fetchAll()
        .then( function(people) {
          return ChartFactory.transformPeopleForForce(people);
        });
      }
    },
    controller: function($scope, forceData) {
      $scope.forceData = forceData;
    }
  });
});
