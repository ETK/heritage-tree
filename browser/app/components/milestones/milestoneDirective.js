app.directive('milestone', function (MilestoneFactory, $state) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      people: '=?', // optional - used for add person
      edittable: '=?'
    },
    templateUrl: 'components/milestones/milestone.html',
    link: function (scope) {

      scope.addPerson = function(person) {
        return MilestoneFactory.addPerson(scope.details.id, person)
        .then( function(updatedMilestone) {
          scope.details = updatedMilestone;
          scope.person = ''; // reset form
        });
      }

      scope.removePerson = function(personId) {
        return MilestoneFactory.removePerson(scope.details.id, personId);
      }

      scope.removeMilestone = function() {
        return MilestoneFactory.removeMilestone(scope.details.id)
        .then( function(resStatus) {
          if(resStatus === 204) $state.reload();
          else console.log('Milestone not found; no action taken.');
        });
      }

      scope.update = function(updates) {
        return MilestoneFactory.updateMilestone(scope.details.id, updates);
      }

    }
  }
});
