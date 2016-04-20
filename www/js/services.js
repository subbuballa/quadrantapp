angular.module('starter.services', [])
.factory('Quadrants',function() {
  var quadrants = [{
    id: 1,
    name: 'Personal',
    description: 'Get all your personal items',
    img: 'img/personal.jpg',
    icon: 'fa-user'
  },{
    id: 2,
    name: 'Work',
    description: 'Get all your work related items',
    img: 'img/work.jpg',
    icon: 'fa-laptop'
  },{
    id: 3,
    name: 'Home',
    description: 'Get all your home related items',
    img: 'img/home.jpg',
    icon: 'fa-home'
  },{
    id: 4,
    name: 'Kids',
    description: 'Get all your kid related items',
    img: 'img/children.jpg',
    icon: 'fa-child'
  }];
  
  function setPersistedData() {
      window.localStorage.setItem('quadrants',JSON.stringify(quadrants));
  }
  setPersistedData();
  
  function getPersistedData() {
      var quadrantJson = window.localStorage.getItem('quadrants');
      return JSON.parse(quadrantJson);
  }
  
  return{
    all: function() {
      return getPersistedData();
    },
    get: function(quadrantId){
      for (var i = 0; i < quadrants.length; i++) {
        if (quadrants[i].id === parseInt(quadrantId)) {
          return quadrants[i];
        }
      }
      return null;
    }
  } 
})
.factory('PrioritiesList',function(){
  var priorityList = [{
    id: 1,
    text: '1 day',
    type: 1
  },
  {
    id: 2,
    text: '2 days',
    type: 1
  },
  {
    id: 3,
    text: '1 week',
    type: 1
  },
  {
    id: 4,
    text: '1 Month',
    type: 1
  },
  {
    id: 5,
    text: '6 months',
    type: 1
  },
  {
    id: 6,
    text: '1 year',
    type: 1
  },
  {
    id: 7,
    text: '3 years',
    type: 1
  },
  {
    id: 8,
    text: '5 years',
    type: 1
  },
  {
    id: 9,
    text: '10 years',
    type: 1
  },
  {
    id: 10,
    text: '20 years',
    type: 1
  }];
  
  return{
    all: function() {
      return priorityList;
    },
    add: function(priority){
      priorityList.push(priority);
    }
  }
})
.factory('Goals',function() {
  var goals = [];
  
  function setPersistedData(goals) {
      window.localStorage.setItem('goals',JSON.stringify(goals));
  }
  
  function getPersistedData() {
      var goalJson = window.localStorage.getItem('goals');
      if(goalJson === 'undefined') return [];
      goals = JSON.parse(goalJson);
  }
  
  //getPersistedData();
  
  return{
    all: function() {
      return goals;
    },
    add: function(goal){
      goals.push(goal);
      //setPersistedData(goals);
    },
    get: function(quadrantId){
      var goalsPerQuadrant = [];
      //var persistedGoals = getPersistedData();
      for (var i = 0; i < goals.length; i++) {
        if (goals[i].quadrantId === parseInt(quadrantId) && goals[i].isUrgent) {
          goalsPerQuadrant.push(goals[i]);
        }
      }
      return goalsPerQuadrant;
    },
    hasGoals: function() {
      //var persistedGoals = getPersistedData();
      return goals.length > 0;
    }
  } 
});
