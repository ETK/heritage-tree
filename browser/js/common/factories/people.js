app.factory('PeopleFactory', function($http) {

  const baseUrl = '/api/people/';

  return {

    fetchAll: function() {
      return $http.get(baseUrl)
      .then(res => res.data);
    },

    fetchById: function(id) {
      return $http.get(baseUrl + id)
      .then(res => res.data);
    },

    updatePerson: function(id, updates) {
      return $http.put(baseUrl + id, updates)
      .then(res => res.data);
    },

    addParent: function(person, parent) {
      return $http.post(baseUrl + person.id + '/parents', parent)
      .then(res => res.data);
    },

    addChild: function(person, child) {
      return $http.post(baseUrl + person.id + '/children', child)
      .then(res => res.data);
    },

    addSpouse: function(person, spouse) {
      return $http.post(baseUrl + person.id + '/spouses', spouse)
      .then(res => res.data);
    },

    removeRelation: function(person, relative) {
      return $http.delete(baseUrl + person.id + '/relationships/' + relative.id)
      .then(res => res.status);
    },

    removeSpouse: function(person, relative) {
      return $http.delete(baseUrl + person.id + '/spouses/' + relative.id)
      .then(res => res.status);
    }

  }
});
