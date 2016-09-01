app.controller('TreeChartCtrl', function ($scope, treeData, people, relations, ChartFactory, $rootScope, treeType) {

  $scope.people = people;
  $scope.treeData = treeData;
  $scope.treeType = treeType;
  console.log('IN CONTROLLER')
  console.log($scope.people);
  console.log($scope.treeData);
  console.log($scope.treeType);

  // display default person in input field
  $scope.startingPerson = {
    identifier: treeData.name + ' ' + treeData.dates,
    id: treeData.id // necessary if one submits without selecting a new person
  };

  $scope.selectStartingPerson = function(startingPerson) {
    ChartFactory.buildTreeData($scope.treeType, people, relations.relations, startingPerson.id)
    .then( function(newTreeData) {
      $rootScope.$broadcast('new-tree-chart-data', newTreeData);
    });
  }

});
