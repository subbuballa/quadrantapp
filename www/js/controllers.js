angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Quadrants) {
  $scope.quadrants = Quadrants.all();
})
.controller('QuadrantDetailCtrl',function($scope, $stateParams, Quadrants, Goals){
  var quadrant = Quadrants.get($stateParams.quadrantId);
  var goalDetails = {
    quadrant: quadrant,
    isUrgent: false,
    isImportant: false,
    description: ''
  };
  
  $scope.goalDetails = goalDetails;
  $scope.goalsByQuadrant = Goals.get($stateParams.quadrantId);
  
  $scope.addGoal = function(goalDetails) {
    var goal = {
      quadrantId: goalDetails.quadrant.id,
      quadrantName: goalDetails.quadrant.name,
      quadrantDesc: goalDetails.quadrant.description,
      isUrgent: goalDetails.isUrgent,
      isImportant: goalDetails.isImportant,
      description: goalDetails.description
    }
    Goals.add(goal);
    $scope.goalDetails ={
      quadrant:goalDetails.quadrant,
      isUrgent: false,
      isImportant: false,
      description: ''
    };
    $scope.goalsByQuadrant = Goals.get($stateParams.quadrantId);
  }
})
.controller('MyQuadrantCtrl', function($scope, Goals) {
  $scope.goals = Goals.all();
  
  $scope.getCssClass = function(goal) {
    var isUrgent = goal.isUrgent;
    var isImportant = goal.isImportant;
    console.log(goal  );
    if(isUrgent&&isImportant) return 'quadrant1';
    if(isUrgent&&!isImportant) return 'quadrant2';
    if(!isUrgent&&isImportant) return 'quadrant3';
    if(!isUrgent&&!isImportant) return 'quadrant4';
    return '';
  }
})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    showHistory: true
  };
});
