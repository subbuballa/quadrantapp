angular.module('starter.services', [])
.factory('Database',['$q','Loki',function BirthdayService($q, Loki) {  
    var _db;
    var _data = {};

    function initDB() {          
        var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});  
        _db = new Loki('quadrantDB',
                {
                    autosave: true,
                    autosaveInterval: 1000, // 1 second
                    //adapter: adapter
                });
        var options = {};
        
        _db.loadDatabase('quadrantDB',function() {
          _data.quadrants = _db.getCollection('quadrants');
          _data.goals = _db.getCollection('goals');
          
          if(!_data.quadrants){
            _db.addCollection('quadrants');
          }
          
          if(!_data.goals){
            _db.addCollection('goals');
          }
          // _data.quadrants = _db.addCollection('quadrants');
          // _data.goals = _db.addCollection('goals');
        });
    };
    
    function getdata(){
      return $q(function(resolve, reject){
         resolve(_data);
      });
    };
    
    
    function add(type,value) {
      if(type == 'goal')
        _data.goals.insert(value);
    }
    
    function update(type,value) {
      if(type == 'goal')
        _data.goals.update(value);
    }
    
    function remove(type,value) {
      if(type == 'goal')
        _data.goals.remove(value);
    }
    
    function find(type, condition) {
      if(type == 'goal')
        return _data.goals.find(condition);
      return [];
    }

    return {
        initDB: initDB,
        getdata: getdata,
        add: add,
        update: update,
        remove: remove,
        find: find
    };
}])
.factory('SQLliteDatabase',['$cordovaSQLite','$q',function(cordovaSQLite,$q){
  var _db;
  var _data = {};
  var _goals = [];

  function initDB() {
    if (window.sqlitePlugin !== undefined) {          
      _db = cordovaSQLite.openDB({name:"quadrant.db",location:'default'});
    }
    else{
      _db = window.openDatabase('quadrant.db', '1.0', 'database', -1);
    }
    // var drop = 'DROP TABLE IF EXISTS goals';
    // query(drop);
    var q = "CREATE TABLE IF NOT EXISTS goals(id integer primary key,quadrantId integer,quadrantName text,quadrantDesc text,isUrgent boolean,isImportant boolean, description text,priority int)";
    query(q);
  };
  
  var query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        _db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });

        return deferred.promise;
    };
  
  function getdata(){
    return query('SELECT * FROM goals');
  };
  
  
  function add(data) {
    var q = "Insert into goals (quadrantId,quadrantName,quadrantDesc,isUrgent,isImportant,description,priority) values (?,?,?,?,?,?,?)";
    var bindings = [data.quadrantId,data.quadrantName,data.quadrantDesc,data.isUrgent,data.isImportant,data.description,data.priority];
    return query(q,bindings);
  }
  
  function update(type,value) {
    if(type == 'goal')
      _data.goals.update(value);
  }
  
  function remove(data) {
    var q = 'DELETE FROM goals WHERE ID = ?'
    var bindings = [data.id];
    return query(q,bindings);
  }
  
  function find(quadrantId) {
    var q = 'SELECT * FROM goals where quadrantId = ?'
    var bindings = [quadrantId];
    return query(q,bindings);
  }

  return {
      initDB: initDB,
      getdata: getdata,
      add: add,
      update: update,
      remove: remove,
      find: find
  };
}])
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
.factory('Goals',['SQLliteDatabase',function(Database) {
  var goals = [];
  var fetchAll = function(result) {
        var output = [];
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }        
        return output;
    };
   
   var convertRowToJSON = function(row){
     var result = "{id:" + row.id + ",description:" + row.goaltext + "}";
     return JSON.stringify(result);;
   }
  
  return{
    all: function() {
      return Database.getdata();
      // .then(function(data){
      //   goals = fetchAll(data);
      // });
    },
    add: function(goal){
      return Database.add(goal);
    },
    remove: function(goal){
      Database.remove('goal',goal);
    },
    find: function(quadrantId){
      return Database.find(quadrantId).then(function(data){
          var goalsByQuadrant = fetchAll(data);
          return getData(goalsByQuadrant);
        });
        
        function getData(goalsByQuadrant){
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
    },
    get: function(quadrantId){
      var goalsPerQuadrant = [];
      for (var i = 0; i < goals.length; i++) {
        if (goals[i].quadrantId === parseInt(quadrantId) && goals[i].isUrgent) {
          goalsPerQuadrant.push(goals[i]);
        }
      }
      return goalsPerQuadrant;
    },
    hasGoals: function() {
      return goals.length > 0;
    }
  } 
}])
.factory('GoalDataFactory',[function(){
  var goals = [];
  return goals;
}]);
