app.directive('peopleList', function (PeopleFactory) {
  return {
    restrict: 'E',
    scope: {
      people: '=',
      person: '=?', // used for single person page
      paginate: '=?',
      numPerPage: '=?',
      paginationId: '=?'
    },
    templateUrl: 'views/people/people-list.html',
    link: function(scope) {
      // set default pagination if not specified
      scope.numPerPage = scope.numPerPage || 10000;
      scope.paginationId = scope.paginationId || 'defaultPagination';

      scope.removeRelation = function(relative) {
        return PeopleFactory.removeRelation(scope.person, relative)
        .then(function(resStatus) {
          if(resStatus === 204) removePersonFromPeople(relative);
          else console.log('Relationship not found; no action taken.')
        });
      }

      function removePersonFromPeople(person) {
        for(var i = 0; i < scope.people.length; i++) {
          if(scope.people[i].id === person.id) {
            scope.people.splice(i, 1);;
            break;
          }
        }
      }

    }
  }
});
