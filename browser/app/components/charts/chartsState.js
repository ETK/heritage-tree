// Tree chart
app.config(function ($stateProvider) {
  $stateProvider.state('treeChart', {
    url: '/charts/tree',
    templateUrl: 'components/charts/treeChart/tree.html',
    controller: 'TreeChartCtrl',
    resolve: {
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false})
      },
      relations: function(PeopleFactory) {
        return PeopleFactory.fetchRelations();
      },
      treeData: function($q, PeopleFactory, ChartFactory) {
        return $q.all([ // TODO: streamline - no need to hit database twice
          PeopleFactory.fetchAll({ includeRelations: false}),
          PeopleFactory.fetchRelations()
        ])
        .then( function(data) {
          return ChartFactory.transformPeopleForTreeChildFirst(data[0], data[1].relations, data[1].spouses);
        });
      }
    },
  });
});

// Vertical tree chart
app.config(function ($stateProvider) {
  $stateProvider.state('topDownTreeChart', {
    url: '/charts/top-down-tree',
    templateUrl: 'components/charts/topDownTreeChart/topDownTree.html',
    resolve: {
      treeData: function($q, PeopleFactory, ChartFactory) {
        return $q.all([
          PeopleFactory.fetchAll({ includeRelations: false}),
          PeopleFactory.fetchRelations()
        ])
        .then( function(data) {
          return ChartFactory.transformPeopleForTopDownTree(data[0], data[1].relations, data[1].spouses);
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
