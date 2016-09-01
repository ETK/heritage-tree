app.controller('TreeChartCtrl', function ($scope, treeData, people, relations, ChartFactory, $rootScope, treeType) {

  $scope.people = people;
  $scope.treeData = treeData;

  $scope.selectStartingPerson = function(startingPerson) {
    ChartFactory.buildTreeData(treeType, people, relations.relations, relations.spouses, startingPerson.id)
    .then( function(newTreeData) {
      $rootScope.$broadcast('new-tree-chart-data', newTreeData);
    });
  }

});
