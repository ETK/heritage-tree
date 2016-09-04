// AUTH_EVENTS is used throughout our app to broadcast and listen from and to the $rootScope
// for important events about authentication flow.
app.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  var statusDict = {
    401: AUTH_EVENTS.notAuthenticated,
    403: AUTH_EVENTS.notAuthorized,
    419: AUTH_EVENTS.sessionTimeout,
    440: AUTH_EVENTS.sessionTimeout
  };
  return {
    responseError: function (response) {
      $rootScope.$broadcast(statusDict[response.status], response);
      return $q.reject(response)
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
});
