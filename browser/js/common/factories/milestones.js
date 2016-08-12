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
    },

    addPerson: function(milestoneId, person) {
      return $http.post(baseUrl + milestoneId + '/person', person)
      .then(res => res.data);
    },

    removePerson: function(milestoneId, personId) {
      return $http.delete(baseUrl + milestoneId + '/person/' + personId)
      .then(res => res.status);
    }

  }
});
