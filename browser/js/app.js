'use strict';
window.app = angular.module('HeritageTree', ['ui.router', 'ui.materialize', 'angularUtils.directives.dirPagination']);

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
