app.factory('ChartFactory', function() {
  return {

    transformPeopleForForce: function(people) {
      var nodes, links = [], relation;
      nodes = people.map( function(person) {
        return { id: person.id, name: person.identifier };
      })
      people.forEach( function(person) {
        relation = person.Children.map( function(child) {
          return { source: person.id, target: child.id };
        })
        if(relation.length) links = links.concat(relation);
      })

      return { nodes: nodes, links: links };
    }

  }
});
