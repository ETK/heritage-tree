// Ancestor-based
app.config(function ($stateProvider) {
  $stateProvider.state('ancestorTreeChart', {
    url: '/charts/tree/ancestor',
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
          return ChartFactory.buildTreeData('ancestor', data[0], data[1].relations, data[1].spouses);
        });
      },
      treeType: function() {
        return 'ancestor';
      }
    },
  });
});

// Descendant-based
app.config(function ($stateProvider) {
  $stateProvider.state('descendantTreeChart', {
    url: '/charts/tree/descendant',
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
          return ChartFactory.buildTreeData('descendant', data[0], data[1].relations, data[1].spouses);
        });
      },
      treeType: function() {
        return 'descendant';
      }
    },
  });
});
