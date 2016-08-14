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

    fetchByPersonId: function(personId) {
      return $http.get(baseUrl + 'person/' + personId)
      .then(res => res.data);
    },

    createMilestone: function(newMilestone) {
      return $http.post(baseUrl, newMilestone)
      .then(res => res.data);
    },

    updateMilestone: function(id, updates) {
      return $http.put(baseUrl + id, updates)
      .then(res => res.data);
    },

    removeMilestone: function(milestoneId) {
      return $http.delete(baseUrl + milestoneId)
      .then(res => res.status);
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
