app.factory('MilestoneFactory', function($http) {

  const baseUrl = '/api/milestones/';

  return {

    fetchAll: function() {
      return $http.get(baseUrl)
      .then(res => res.data);
    },

    fetchById: function(id) {
      return $http.get(baseUrl + id)
      .then(res => res.data);
    }

  }
});
