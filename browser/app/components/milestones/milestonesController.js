app.controller('MilestonesController', function ($scope, milestones, people, MilestoneFactory, $state) {

  $scope.milestones = milestones;
  $scope.people = people;

  $scope.createMilestone = function(newMilestone) {
    return MilestoneFactory.createMilestone(newMilestone)
    .then(() => $state.reload());
  }

});
