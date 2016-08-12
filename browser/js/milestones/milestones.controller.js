app.controller('MilestonesController', function ($scope, milestones, people, MilestoneFactory) {

  $scope.milestones = milestones;
  $scope.people = people;

  $scope.createMilestone = function(newMilestone) {
    return MilestoneFactory.createMilestone(newMilestone)
    .then( function(createdMilestone) {
      $scope.milestones.push(createdMilestone);
    });
  }

});
