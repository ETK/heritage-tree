app.directive('peopleList', function () {
  return {
    restrict: 'E',
    scope: {
      people: '=',
      paginate: '=?',
      numPerPage: '=?',
      paginationId: '=?'
    },
    templateUrl: 'views/people/people-list.html',
    link: function(scope) {
      // set default pagination if not specified
      scope.numPerPage = scope.numPerPage || 10000;
      scope.paginationId = scope.paginationId || 'defaultPagination';
    }
  }
});
