app.controller('TreeChartCtrl', function ($scope, treeData, people, relations, ChartFactory, $rootScope, treeType) {

  $scope.people = people;
  $scope.treeData = treeData;

  // display default person in input field
  $scope.startingPerson = {
    identifier: treeData.name + ' ' + treeData.dates,
    id: treeData.id // necessary if one submits without selecting a new person
  };

  $scope.selectStartingPerson = function(startingPerson) {
    ChartFactory.buildTreeData(treeType, people, relations.relations, startingPerson.id)
    .then( function(newTreeData) {
      $rootScope.$broadcast('new-tree-chart-data', newTreeData);
    });
  }

});
