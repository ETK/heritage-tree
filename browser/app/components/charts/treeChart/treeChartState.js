app.config(function ($stateProvider) {

  // Ancestor-based
  $stateProvider.state('ancestorTreeChart', {
    url: '/charts/tree/ancestor/:startingId',
    templateUrl: 'components/charts/treeChart/tree.html',
    controller: 'TreeChartCtrl',
    resolve: {
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false})
      },
      relations: function(PeopleFactory) {
        return PeopleFactory.fetchRelations();
      },
      treeType: function() {
        return 'ancestor';
      },
      treeData: function(people, relations, treeType, ChartFactory, $stateParams) {
        return ChartFactory.buildTreeData(treeType, people, relations.relations, $stateParams.startingId);
      }
    },
  });

  // Descendant-based
  $stateProvider.state('descendantTreeChart', {
    url: '/charts/tree/descendant/:startingId',
    templateUrl: 'components/charts/treeChart/tree.html',
    controller: 'TreeChartCtrl',
    resolve: {
      people: function(PeopleFactory) {
        return PeopleFactory.fetchAll({ includeRelations: false})
      },
      relations: function(PeopleFactory) {
        return PeopleFactory.fetchRelations();
      },
      treeType: function() {
        return 'descendant';
      },
      treeData: function(people, relations, treeType, ChartFactory, $stateParams) {
        return ChartFactory.buildTreeData(treeType, people, relations.relations, $stateParams.startingId);
      }
    },
  });
});
