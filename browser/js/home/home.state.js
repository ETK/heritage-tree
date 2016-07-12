app.config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html',
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
