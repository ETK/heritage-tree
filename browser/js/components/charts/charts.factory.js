app.factory('ChartFactory', function() {

  function nestRelation(relations) {

  }

  // Exported functionality

  return {

    transformPeopleForForce: function(people) {
      var nodes, links = [], relation, spouse;
      nodes = people.map( function(person) {
        return { id: person.id, name: person.identifier, last_name: person.last_name };
      });
      people.forEach( function(person) {
        relation = person.Children.map( function(child) {
          return { source: person.id, target: child.id, type: 'parent-child' };
        });
        spouse = person.Spouses.map( function(spouse) {
          return { source: person.id, target: spouse.id, type: 'spouse' };
        });
        if(relation.length) links = links.concat(relation);
        if(spouse.length) links = links.concat(spouse);
      });

      return { nodes: nodes, links: links };
    },

    transformPeopleForTree: function(dbPeople, relations, spouses) {
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
          birth_year: person.birth_year
        };
        // track oldest person
        if(person.birth_year && person.birth_year < oldest.birth_year) {
          oldest = person;
          oldest.idx = index;
        }
      });

      // generate array of children for each person
      // transform relations into key = person_id; value = array of children_ids
      var children = {};
      relations.forEach( function(relation) {
        if(!children[relation.parent_id]) children[relation.parent_id] = [];
        children[relation.parent_id].push( relation.person_id );
      });

      // add him/her
      var nestedPeople = {
        idx: oldest.idx,
        id: oldest.id,
        name: oldest.identifier
      }

      var queue = [];
      // append children
      if(children[oldest.id]) {
        nestedPeople.children = children[oldest.id].map( function(childId) {
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
    },

    transformPeopleForTreeChildFirst: function(dbPeople, relations, spouses) {
      var initialIdx,
          nodesInit;

      var people = {}, // processed list of people
          targetPersonId = 1329;

      dbPeople.forEach( function(person, index) {
        // transform relations into key = person_id; value = basic values
        people[person.id] = {
          id: person.id,
          name: person.full_name,
          birth_location: person.birth_location,
          dates: person.dates
        };
      });

      // generate array of children for each person
      // transform relations into key = person_id; value = array of children_ids
      var parents = {};
      relations.forEach( function(relation) {
        if(!parents[relation.person_id]) parents[relation.person_id] = [];
        parents[relation.person_id].push( relation.parent_id );
      });

      // start final list of people with the target person
      // add him/her
      var nestedPeople = people[targetPersonId];

      var queue = [];
      // append parents
      if(parents[targetPersonId]) {
        nestedPeople.parents = parents[targetPersonId].map( function(parentId) {
          queue.push(people[parentId]);
          return people[parentId];
        })
      }

      // use BST=>breadth first to continue appending parents
      var currPerson;
      while(queue.length) {
        currPerson = queue.shift();
        // find & append children
        if(parents[currPerson.id]) {
          currPerson.parents = parents[currPerson.id].map( function(parentId) {
            queue.push(people[parentId]);
            return people[parentId];
          });
        }
      }

      return nestedPeople;
    },

  }
});
