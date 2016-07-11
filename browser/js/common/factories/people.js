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
    }

  }
});
