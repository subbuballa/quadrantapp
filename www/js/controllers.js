angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Quadrants, Goals) {
  var quadrants = Quadrants.all();
  
  function getOptions(title){
    var options = {  
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
            title: title,
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
    return options;
  }
   
var data = [  
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
function getData(quadrantId){
  console.log('hesdd');
  var goalsByQuadrant = Goals.find({'quadrantId': {'$eq': quadrantId}});
  var data = [];
  for(var i=0;i<goalsByQuadrant.length;i++){
    var key = getKey(goalsByQuadrant[i]);
    if(!data[key]){
      data[key] = 1;
    }
    else{
      data[key] = data[key]+1;
    }
  }
  var result = [];
  for(key in data){
    result.push({key:key,y:data[key]});
  }  
  return result;
}

function getKey(quadrant){
  if(quadrant.isUrgent&&quadrant.isImportant) return 'quadrant1';
  if(quadrant.isUrgent&&!quadrant.isImportant) return 'quadrant2';
  if(!quadrant.isUrgent&&quadrant.isImportant) return'quadrant3';
  if(!quadrant.isUrgent&&!quadrant.isImportant) return 'quadrant4';
}

function getQuadrantData(){
  var quadrantData = [];
  for(var i=0;i<quadrants.length;i++){
    var quadrant = {};
    quadrant.options = getOptions(quadrants[i].name);
    quadrant.data = data;//getData(quadrants[i].id);
    quadrant.name = quadrants[i].name;
    quadrant.description = quadrants[i].description;
    quadrant.icon = quadrants[i].icon;
    quadrant.quadrant = quadrant;
    quadrantData.push(quadrant);
  }
  return quadrantData;
}
$scope.quadrantData = getQuadrantData();

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
.controller('QuadrantDetailCtrl',function($scope, $stateParams, $filter
          , $ionicModal, Quadrants, Goals, PrioritiesList,$ionicPlatform,Database){  
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
.controller('GoalsCtrl', function($scope,$ionicPlatform, Goals) {
  $scope.hasGoals = false;  
  
  Goals.all().then(function(data){
        $scope.goals = data.goals.data;
        if($scope.goals.length > 0){
          $scope.hasGoals = true;
        }
      });;
  
  $scope.$watch('goals',function(newVal){
    $scope.goals = newVal;
  });
  
  $scope.getGoals = function(){
    return Goals.all().then(function(data){
        $scope.goals = data.goals.data;
      });
  }
  
  $scope.deleteGoal = function(goal){
    Goals.remove(goal);
  }
  
  $scope.hasGoals = function(){
    return $scope.goals.length > 0;
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
