app.directive('peopleList', function (PeopleFactory, MilestoneFactory) {
  return {
    restrict: 'E',
    scope: {
      people: '=',
      person: '=?', // used for single person page
      type: '=?', // people list type, for special cases
      paginate: '=?',
      numPerPage: '=?',
      paginationId: '=?',
      removeFn: '=',
      edittable: '=?'
    },
    templateUrl: 'components/people/peopleList/peopleList.html',
    link: function(scope) {
      // set defaults if not specified
      scope.type = scope.type || 'parent-child';
      scope.numPerPage = scope.numPerPage || 10000;
      scope.paginationId = scope.paginationId || 'defaultPagination';

      // TODO: improve case handling
      scope.removeRelation = function(relative) {
        var fn,
            baseId,
            relationId = relative.id;

        if(scope.type === 'spouses') {
          fn = PeopleFactory.removeSpouse;
          baseId = scope.person.id;
        } else if(scope.type === 'milestone' ) {
          fn = scope.removeFn;
          baseId = relative.id; // milestone's remove function only requires the personId ("relative")
        } else {
          fn = PeopleFactory.removeRelation;
          baseId = scope.person.id;
        }
        return fn(baseId, relationId)
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
