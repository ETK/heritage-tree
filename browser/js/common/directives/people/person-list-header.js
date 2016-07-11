app.directive('personListHeader', function () {
  return {
    restrict: 'E',
    scope: {
      person: '='
    },
    templateUrl: 'views/people/person-list-header.html'
  }
});
