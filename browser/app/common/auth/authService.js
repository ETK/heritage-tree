app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

  function onSuccessfulLogin(response) {
    var data = response.data;
    Session.create(data.id, data.user);
    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    $rootScope.user = data.user;
    return data.user;
  }

  // Check if an authenticated user is currently registered
  this.isAuthenticated = function () {
    return !!Session.user;
  };

  this.getLoggedInUser = function (fromServer) {
    // Default: returns user from session
    if (this.isAuthenticated() && fromServer !== true) {
      return $q.when(Session.user);
    }

    // Make request GET /session.
    // If it returns a user, call onSuccessfulLogin with the response.
    // If it returns a 401 response, we catch it and instead resolve to null.
    return $http.get('/session')
    .then(onSuccessfulLogin)
    .catch(()=> null);

  };

  this.login = function (credentials) {
    return $http.post('/login', credentials)
      .then(onSuccessfulLogin)
      .catch(function () {
        return $q.reject({ message: 'Invalid login credentials.' });
      });
  };

  this.logout = function () {
    return $http.get('/logout').then(function () {
      Session.destroy();
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      $rootScope.user = null;
    });
  };

});
