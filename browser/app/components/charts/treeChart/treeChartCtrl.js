app.controller('TreeChartCtrl', function ($scope, treeData, people, relations, ChartFactory, $rootScope, treeType, Title) {

  $scope.people = people;
  $scope.treeData = treeData;
  $scope.treeType = treeType;

  // display default person in input field
  $scope.startingPerson = {
    identifier: treeData.name + ' ' + treeData.dates,
    id: treeData.id // necessary if one submits without selecting a new person
  };

  // set page title for <title> tag + page header
  $scope.pageTitle = treeType[0].toUpperCase() + treeType.substr(1) + 's of ' + $scope.startingPerson.identifier;
  Title.setTitle($scope.pageTitle);

  $scope.selectStartingPerson = function(startingPerson) {
    ChartFactory.buildTreeData($scope.treeType, people, relations.relations, startingPerson.id)
    .then( function(newTreeData) {
      $rootScope.$broadcast('new-tree-chart-data', newTreeData);
    });
  }

});
