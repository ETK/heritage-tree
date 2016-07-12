app.factory('ChartFactory', function() {
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
    }

  }
});
