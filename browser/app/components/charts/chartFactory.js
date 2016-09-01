app.factory('ChartFactory', function($q) {

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

    buildTreeData: function(treeType, dbPeople, relations, startingPersonId) {
      console.log("IN FACTORY")

      var initialIdx,
          nodesInit;

      var people = {}; // processed list of people

      // Starting person - by default, me (ancestor) or Robert Lincoln (descendant)
      if(treeType === 'ancestor') startingPersonId = startingPersonId || 1329;
      else startingPersonId = startingPersonId || 972;

      dbPeople.forEach( function(person, index) {
        // transform relations into key = person_id; value = basic values
        people[person.id] = {
          id: person.id,
          name: person.full_name,
          birth_location: person.birth_location,
          dates: person.dates
        };
      });

      console.log('DONE PROCESSING PEOPLE')

      // generate array of next nodes (parents or children) for each person
      // transform relations into key = person_id; value = array of children_ids
      var nextPeople = {};
      relations.forEach( function(relation) {
        if(treeType === 'ancestor') {
          if(!nextPeople[relation.person_id]) nextPeople[relation.person_id] = [];
          nextPeople[relation.person_id].push( relation.parent_id );
        } else {
          if(!nextPeople[relation.parent_id]) nextPeople[relation.parent_id] = [];
          nextPeople[relation.parent_id].push( relation.person_id );
        }
      });

      console.log('DONE PROCESSING RELATIONS')


      // start final list of people with the target person
      // add him/her
      var nestedPeople = people[startingPersonId];

      var queue = [];
      // append next nodes
      if(nextPeople[startingPersonId]) {
        nestedPeople.nextPeople = nextPeople[startingPersonId].map( function(nextPersonId) {
          queue.push(people[nextPersonId]);
          return people[nextPersonId];
        })
      }

      console.log('STARTING BREADTH FIRST TRAVERSAL')


      // use BST=>breadth first to continue appending parents
      var currPerson;
      while(queue.length) {
        currPerson = queue.shift();
        // find & append children
        if(nextPeople[currPerson.id]) {
          currPerson.nextPeople = nextPeople[currPerson.id].map( function(nextPersonId) {
            queue.push(people[nextPersonId]);
            return people[nextPersonId];
          });
        }
      }

      console.log('DONE IN FACTORY')
      console.log(nestedPeople)

      return $q(function(resolve) {
        resolve(nestedPeople);
      });
    },

  }
});
