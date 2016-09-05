app.config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'components/home/home.html',
    controller: function($scope, $state) {

      $scope.quickCharts = [
        { label: 'Szymanowski family', description: 'Dating back to 19th Century Poland', type: 'ancestor', startingId: 1328 },
        { label: 'Lincoln family', description: 'Dating back to 15th Century England', type: 'ancestor', startingId: 665 },
        { label: 'Hendrickson family', description: 'Dating back to 12th Century Netherlands', type: 'ancestor', startingId: 1335 },
        { label: 'Wells family', description: 'Dating back to 19th Century England', type: 'ancestor', startingId: 1336 },
        { label: 'Common ancestry with Abraham Lincoln', description: 'Common ancestry with President Lincoln dates to 1525', type: 'descendant', startingId: 970 },
        { label: 'Lincoln family relationship to John Locke', description: 'Common ancestry with English philosopher dates to 1517', type: 'descendant', startingId: 2316 },
        { label: 'Lincoln family relationship to B.F. Goodrich', description: 'Common ancestry with early tire innovator dates to 1663', type: 'descendant', startingId: 2068 },
        { label: 'Lincoln family relationship to Daniel Boone', description: 'Common ancestry with American pioneer explorer, by marriage, dates to 1666', type: 'descendant', startingId: 1657 },
        { label: 'Hendrickson family relationship to Mesier family', description: 'Family owned much of lower Manhattn in 17th Century New Amsterdam, including the current World Trade Center site.', type: 'descendant', startingId: 2251 }
      ];

    }
  });
});
