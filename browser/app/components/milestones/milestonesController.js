app.controller('MilestonesController', function ($scope, $rootScope, milestones, people, MilestoneFactory, $state, Title) {
  Title.setTitle('Family Milestones');
  $scope.edittable = $rootScope.user && $rootScope.user.is_admin;

  $scope.milestones = milestones;
  $scope.people = people;

  $scope.createMilestone = function(newMilestone) {
    return MilestoneFactory.createMilestone(newMilestone)
    .then(() => $state.reload());
  }

});
