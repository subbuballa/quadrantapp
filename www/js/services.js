angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

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
  
  return{
    all: function() {
      return quadrants;
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
  
  return{
    all: function() {
      return goals;
    },
    add: function(goal){
      goals.push(goal);
    },
    get: function(quadrantId){
      var goalsPerQuadrant = [];
      for (var i = 0; i < goals.length; i++) {
        if (goals[i].quadrantId === parseInt(quadrantId) && goals[i].isUrgent) {
          goalsPerQuadrant.push(goals[i]);
        }
      }
      return goalsPerQuadrant;
    }
  } 
});
