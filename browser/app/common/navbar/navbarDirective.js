app.directive('navbar', function (PeopleFactory, $state, AuthService, $rootScope, AUTH_EVENTS) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'common/navbar/navbar.html',
    link: function (scope) {

      PeopleFactory.fetchAll({ includeRelations: false })
      .then(people => { scope.people = people; });

      scope.navItems = [
        { label: 'People', state: 'people' },
        { label: 'Milestones', state: 'milestones' },
      ];

      scope.chartItems = [
        { label: 'Ancestor Tree Chart', state: 'ancestorTreeChart' },
        { label: 'Descendant Tree Chart', state: 'descendantTreeChart' },
        { label: 'Force Chart', state: 'forceChart' }
      ]

      // User functionality
      scope.user = null;

      scope.isLoggedIn = function () { return AuthService.isAuthenticated(); };

      scope.logout = function () {
        AuthService.logout()
        .then(() => { $state.go('home') });
      };

      function setUser() {
        AuthService.getLoggedInUser()
        .then(user => { scope.user = user });
      };

      function removeUser() { scope.user = null; };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

    }

  };

});
