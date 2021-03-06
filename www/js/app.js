// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'nvd3', 'lokijs', 'underscore', 'starter.controllers', 'starter.services'])

.run(function ($ionicPlatform, Database, SQLliteDatabase, $sqliteService) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        // Database.initDB();
        SQLliteDatabase.initDB();
        SQLliteDatabase.createDB();
        //$sqliteService.preloadDataBase(true);
        console.log('ionic platform ready');
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab',
            {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:
            .state('tab.dash',
            {
                url: '/dash',
                cache: false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.dash.detail',
            {
                url: '/:quadrantId',
                cache: false,
                views: {
                    'tab-dash@tab': {
                        templateUrl: 'templates/tab-dash-detail.html',
                        controller: 'DashDetailCtrl'
                    }
                }
            })
            .state('tab.myquadrants',
            {
                url: '/myquadrants',
                views: {
                    'tab-myquadrants': {
                        templateUrl: 'templates/tab-myquadrants.html',
                        controller: 'MyQuadrantCtrl'
                    }
                }
            })
            .state('tab.quadrant-detail',
            {
                url: '/quadrants/:quadrantId',
                views: {
                    'tab-myquadrants': {
                        templateUrl: 'templates/quadrant-detail.html',
                        controller: 'QuadrantDetailCtrl'
                    }
                }
            })
            .state('tab.goals',
            {
                url: '/goals',
                cache: false,
                views: {
                    'tab-goals': {
                        templateUrl: 'templates/tab-goals.html',
                        controller: 'GoalsCtrl',
                    }
                }
            })
            .state('tab.goal-detail',
            {
                url: '/goals/:goalid',
                cache: false,
                views: {
                    'tab-goals': {
                        templateUrl: 'templates/tab-goal-detail.html',
                        controller: 'GoalDetailCtrl',
                    }
                }
            })
            .state('tab.account',
            {
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'AccountCtrl'
                    }
                }
            });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/dash');

});
