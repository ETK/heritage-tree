app.directive('milestone', function (MilestoneFactory) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      people: '='
    },
    templateUrl: 'views/milestones/milestone.html',
    link: function (scope) {

      scope.addPerson = function(person) {
        return MilestoneFactory.addPerson(scope.details.id, person)
        .then( function(updatedMilestone) {
          scope.details = updatedMilestone;
        });
      }

    }
  }
});
