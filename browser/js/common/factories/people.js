app.factory('PeopleFactory', function($http) {

  const baseUrl = '/api/people';

  return {

    fetchAll: function() {
      return $http.get(baseUrl)
      .then(res => res.data);
    }

  }
});
