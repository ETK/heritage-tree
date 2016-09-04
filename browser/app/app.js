'use strict';
window.app = angular.module('HeritageTree', ['ui.router', 'ui.bootstrap', 'angularUtils.directives.dirPagination']);

app.config(function ($urlRouterProvider, $locationProvider) {
  // This turns off hashbang urls (/#about) and changes it to something normal (/about)
  $locationProvider.html5Mode(true);
  // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
  $urlRouterProvider.otherwise('/');
  // Trigger page refresh when accessing an OAuth route
  // $urlRouterProvider.when('/auth/:provider', function () {
  //     window.location.reload();
  // });
});

app.run(function($rootScope, Title, $state) {
  $rootScope.page = {
    baseTitle: 'HeritageTree'
  }

  // reset page title on state change; title may be set by Controllers
  $rootScope.$on('$stateChangeSuccess', function() {
    Title.resetTitle();
  });
});
