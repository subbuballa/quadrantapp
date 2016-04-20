angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Quadrants) {
  $scope.options = {  
  chart: {
    type: 'pieChart',
    height: 200,
    x: function(d){return d.key;},
    y: function(d){return d.y;},
    showLabels: false,
    duration: 500,
    labelThreshold: 0.01,
    labelSunbeamLayout: true,
    width: 200,
    title: "Personal",
    donut: true,
    tooltips: false,
    showLegend: false,
    legend: {
      margin: {
        top: 5,
        right: 0,
        bottom: 5,
        left: 0
      }
    }
  }
};
$scope.data = [  
  {
    key: "urgent & important",
    y: 4
  },
  {
    key: "urgent & not-important",
    y: 2
  },
  {
    key: "important & not urgent",
    y: 2
  },
  {
    key: "Not urgent & not important",
    y: 0
  }
];
})
.controller('MyQuadrantCtrl', function($scope, $ionicModal, $filter, Quadrants) {
  $ionicModal.fromTemplateUrl('templates/availableQuadrants.html',{
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });
  var selectedQuadrants = Quadrants.all();
  var quadrantMatrix = $filter('columnsInGrid')(selectedQuadrants,3);
  $scope.quadrants = quadrantMatrix;
  $scope.allQuadrants = Quadrants.all();
})
.controller('QuadrantDetailCtrl',function($scope, $stateParams, $filter, $ionicModal, Quadrants, Goals, PrioritiesList){
  
  $ionicModal.fromTemplateUrl('templates/addCustomPriority.html',{
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });
  $scope.priority = {};
  
   $scope.createContact = function(u) {
     var priority = {
          id: 11,
          text: u.custom,
          type: 2
        }
    PrioritiesList.add(priority);
    $scope.modal.hide();
    refreshProrityList();
  };
  
  var quadrant = Quadrants.get($stateParams.quadrantId);
  var goalDetails = {
    quadrant: quadrant,
    isUrgent: false,
    isImportant: false,
    description: '',
    selectedPriority: -1
  };
  
  $scope.goalDetails = goalDetails;
  //$scope.goalsByQuadrant = Goals.get($stateParams.quadrantId);
  
  
  function refreshProrityList() {
    var pList = PrioritiesList.all();
    var filteredList = $filter('columnsInGrid')(pList,2);
    $scope.priorityList = filteredList;
    $scope.selectedPriority = 0;
    $scope.priorities = PrioritiesList.all();
  }
  
  refreshProrityList();
  
  $scope.addGoal = function(goalDetails) {
    var goal = {
      quadrantId: goalDetails.quadrant.id,
      quadrantName: goalDetails.quadrant.name,
      quadrantDesc: goalDetails.quadrant.description,
      isUrgent: goalDetails.isUrgent,
      isImportant: goalDetails.isImportant,
      description: goalDetails.description,
      priority: goalDetails.selectedPriority
    }
    Goals.add(goal);
    $scope.goalDetails ={
      quadrant:goalDetails.quadrant,
      isUrgent: false,
      isImportant: false,
      description: '',
      selectedPriority: 0
    };
    //$scope.goalsByQuadrant = Goals.get($stateParams.quadrantId);
    $scope.selectedPriority = -1;
  }
  
  $scope.isDisabled = function(goalDetails) {
    if(goalDetails.description == '') return true;
    if(goalDetails.selectedPriority <= 0) return true;
    return false;
  }
})
.controller('GoalsCtrl', function($scope, Goals) {
  var goals = Goals.all();
  $scope.getGoals = function(){
    return Goals.all();
  }
  $scope.hasGoals = function(){
    return Goals.hasGoals();
  };
  $scope.getCssClass = function(goal) {
    var isUrgent = goal.isUrgent;
    var isImportant = goal.isImportant;
    if(isUrgent&&isImportant) return 'quadrant1';
    if(isUrgent&&!isImportant) return 'quadrant2';
    if(!isUrgent&&isImportant) return 'quadrant3';
    if(!isUrgent&&!isImportant) return 'quadrant4';
    return '';
  }
})
.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    showHistory: true
  };
})
.filter('columnsInGrid',function(){
  function listToMatrix(list, elementsInSubArray){
    var matrix = [],i,k;
    for(i=0,k=-1;i<list.length;i++){
      if(i % elementsInSubArray === 0){
        k++;
        matrix[k] = [];
      }
      matrix[k].push(list[i]);
    }
    return matrix;
  }
  
  return function(list,elementsInSubArray){
    return listToMatrix(list,elementsInSubArray);
  };
})
.filter('listToMatrix', function() {
    function listToMatrix(list, elementsPerSubArray) {
        var matrix = [], i, k;

        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }

            matrix[k].push(list[i]);
        }

        return matrix;
    }
    return function(list, elementsPerSubArray) {
        return listToMatrix(list, elementsPerSubArray);
    };
});
