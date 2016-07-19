// Tree chart
app.config(function ($stateProvider) {
  $stateProvider.state('treeChart', {
    url: '/charts/tree',
    templateUrl: 'views/charts/tree.html',
    resolve: {
      treeData: function($q, PeopleFactory, ChartFactory) {
        return $q.all([
          PeopleFactory.fetchAll({ includeRelations: false}),
          PeopleFactory.fetchRelations()
        ])
        .then( function(data) {
          return ChartFactory.transformPeopleForTree(data[0], data[1]);
        });
      }
    },
    controller: function($scope, treeData) {
      $scope.treeData = treeData;
    }
  });
});

// Force chart
app.config(function ($stateProvider) {
  $stateProvider.state('forceChart', {
    url: '/charts/force',
    templateUrl: 'views/charts/force.html',
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
