app.directive('milestone', function () {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'views/milestones/milestone.html',
    // link: function (scope) {
    // }
  }
});
