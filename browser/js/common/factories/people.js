app.factory('PeopleFactory', function($http) {

  const baseUrl = '/api/people/';

  return {

    fetchAll: function(options) {
      return $http({
        method: 'GET',
        url: baseUrl,
        params: options
      })
      .then(res => res.data);
    },

    fetchById: function(id) {
      return $http.get(baseUrl + id)
      .then(res => res.data);
    },

    fetchRelations: function() {
      return $http.get(baseUrl + 'relations')
      .then(res => res.data);
    },

    // Create a person - name format is one of:
    // -- [first] [middle] [last] [suffix]
    // -- [first] [middle] [last]
    // -- [first] [last]
    createPerson: function(nameStr) {
      var nameArr = nameStr.split(' '),
          nameObj = {};
      nameObj.first_name = nameArr[0];
      if(nameArr.length === 4) {
        nameObj.suffix = nameArr[3];
      }
      if(nameArr.length >= 3) {
        nameObj.middle_name = nameArr[1];
        nameObj.last_name = nameArr[2];
      } else {
        nameObj.last_name = nameArr[1];
      }
      return $http.post(baseUrl, nameObj)
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
