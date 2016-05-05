angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Quadrants, Goals,$q,$state,SQLliteDatabase) {
  //SQLliteDatabase.initDB();
  var quadrants = Quadrants.all();
  $scope.message = '';
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
  $scope.navigateTo = function(id){
    $state.go('tab.dash.detail', {quadrantId: id});
  } 

  function getQuadrantData(){
    
    var quadrantData = [];
    var message = '';
    Goals.find(1)
      .then(function(result){
        getDataByQuadrant(result);
      });
    return quadrantData;
  }

  function getDataByQuadrant(data){
      var groupedData = []; 
      angular.forEach(quadrants,function(q,index){
        var quadrant = {};
        quadrant.name = q.name;
        quadrant.description = q.description;
        quadrant.icon = q.icon;
        quadrant.id = q.id;
        quadrant.quadrant = q;
        quadrant.options = getOptions(q.name);
        quadrant.data = getArray(data[q.id]);
        quadrant.total = getTotal(data[q.id])
        groupedData.push(quadrant);
    });
    $scope.quadrantData = groupedData;
  }

  function getArray(data){
    var result = [];
    if(data){
      angular.forEach(data[0],function(item,key){
        result.push({key:key,y:item.length});
      });
    }
    return result;
  }

function getTotal(data){
  var result = 0;
  if(data){
    angular.forEach(data[0],function(item,key){
      result = result + item.length;
    });
  }
  return result;
}

try{
  getQuadrantData();
}
catch(e){
  $scope.message = e.stack;
}

})
.controller('DashDetailCtrl',function($scope,$stateParams,Quadrants,Goals,_,SQLliteDatabase){
  //var quadrants = Quadrants.all();
  SQLliteDatabase.initDB();
  var qId = $stateParams.quadrantId;
  var curQuadrant = Quadrants.get($stateParams.quadrantId);
  console.log(curQuadrant);
  $scope.goals = [];
  $scope.quadrant = [];
   function getQuadrantData(){
      var quadrantData = [];
      var message = '';
      Goals.find(1)
        .then(function(result){
          getDataByQuadrant(result);
          if(!result){
            $scope.goals = result[qId];
          }
        });
        Goals.get(curQuadrant.id).then(function(result) {
          var goals = result;
          angular.forEach(goals,function(goal,index){
          goal.quadrantClass = getCssClass(goal);
        });
          $scope.goals = _.sortBy(goals,'quadrantClass');
          $scope.q1 = _.where(goals,{quadrantClass:'quadrant1'}).length;
          $scope.q2 = _.where(goals,{quadrantClass:'quadrant2'}).length;
          $scope.q3 = _.where(goals,{quadrantClass:'quadrant3'}).length;
          $scope.q4 = _.where(goals,{quadrantClass:'quadrant4'}).length;
        });
      return quadrantData;
  }
  function getCssClass(goal) {
    var isUrgent = goal.isUrgent == "true";
    var isImportant = goal.isImportant == "true";
    if(isUrgent&&isImportant) return 'quadrant1';
    if(isUrgent&&!isImportant) return 'quadrant2';
    if(!isUrgent&&isImportant) return 'quadrant3';
    if(!isUrgent&&!isImportant) return 'quadrant4';
    return '';
  }
  function getOptions(title){
    var options = {  
            chart: {
            type: 'pieChart',
            height: 150,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: false,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            width: 150,
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
  function getDataByQuadrant(data){
      var quadrant = {};
      quadrant.name = curQuadrant.name;
      quadrant.description = curQuadrant.description;
      quadrant.icon = curQuadrant.icon;
      quadrant.id = curQuadrant.id;
      quadrant.quadrant = curQuadrant;
      quadrant.options = getOptions(curQuadrant.name);
      quadrant.data = getArray(data[curQuadrant.id]);
      quadrant.total = getTotal(data[curQuadrant.id])
      $scope.quadrant = quadrant;
  }

function getArray(data){
  var result = [];
  if(data){
    angular.forEach(data[0],function(item,key){
      result.push({key:key,y:item.length});
    });
  }
  return result;
}

function getTotal(data){
  var result = 0;
  if(data){
    angular.forEach(data[0],function(item,key){
      result = result + item.length;
    });
  }
  return result;
}
try{
  getQuadrantData();
}
catch(e){
  $scope.message = e.message;
}
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
          , $ionicModal, Quadrants, Goals, PrioritiesList,$ionicPlatform,Database,GoalDataFactory){  
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
    Goals.add(goal).then(function(data){
        Goals.all().then(function(data){
          GoalDataFactory.goals = fetchAll(data);
        });
      });
  
  function fetchAll(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };;
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
.controller('GoalsCtrl', function($scope,$ionicPlatform, Goals,GoalDataFactory,_) {
  $scope.hasGoals = null;  
  $scope.showSpinner = null; 
  $scope.message = '';
  $scope.goals = Goals.all().then(function(data){
        GoalDataFactory.goals = fetchAll(data);
        angular.forEach(GoalDataFactory.goals,function(goal,index){
          goal.quadrantClass = getCssClass(goal);
        });
        $scope.goals = _.sortBy(GoalDataFactory.goals,'quadrantClass');
        $scope.showSpinner = false;
        if(GoalDataFactory.goals.length > 0){
          $scope.hasGoals = true;
        }
        else{
          $scope.hasGoals = false;
          $scope.message = 'Currently you dont have any goals, set goals in My Quadrants';
        }
      });;
  
  function fetchAll(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };
  $scope.$watch('GoalDataFactory.goals',function(newVal){
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
  function getCssClass(goal) {
    var isUrgent = goal.isUrgent == "true";
    var isImportant = goal.isImportant == "true";
    if(isUrgent&&isImportant) return 'quadrant1';
    if(isUrgent&&!isImportant) return 'quadrant2';
    if(!isUrgent&&isImportant) return 'quadrant3';
    if(!isUrgent&&!isImportant) return 'quadrant4';
    return '';
  }
})
    .controller('GoalDetailCtrl', function ($scope) {
        
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
