app.factory('ChartFactoryOld', function($q) {

  // Exported functionality

  return {

    transformPeopleForTopDownTree: function(dbPeople, relations, spouses) {
      var initialIdx,
          nodesInit;

      // process list of people
      var people = {},
          oldest = { birth_year: new Date().getYear() + 1900 };
      dbPeople.forEach( function(person, index) {
        // transform relations into key = person_id; value = basic values
        people[person.id] = {
          id: person.id,
          name: person.identifier,
          birth_location: person.birth_location,
          dates: person.dates,
          birth_year: person.birth_year
        };
        // track oldest person
        if(person.birth_year && person.birth_year < oldest.birth_year) {
          oldest = person;
          oldest.idx = index;
        }
      });

      // var startingPersonId = oldest.id; // need to simplify
      var startingPersonId = 972; // oldest Lincoln
      // var startingPersonId = 2084; // Goodrich

      // generate array of children for each person
      // transform relations into key = person_id; value = array of children_ids
      var children = {};
      relations.forEach( function(relation) {
        if(!children[relation.parent_id]) children[relation.parent_id] = [];
        children[relation.parent_id].push( relation.person_id );
      });

      // add him/her
      var nestedPeople = people[startingPersonId];

      var queue = [];
      // append children
      if(children[startingPersonId]) {
        nestedPeople.children = children[startingPersonId].map( function(childId) {
          queue.push(people[childId]);
          return people[childId];
        })
      }

      // use BST=>breadth first to continue appending children
      var currPerson;
      while(queue.length) {
        currPerson = queue.shift();
        // find & append children
        if(children[currPerson.id]) {
          currPerson.children = children[currPerson.id].map( function(childId) {
            queue.push(people[childId]);
            return people[childId];
          });
        }
      }

      return nestedPeople;
    }

  }
});
