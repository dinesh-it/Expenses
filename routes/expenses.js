var Db = require('mongodb').Db;
        MongoClient = require('mongodb').MongoClient,
        Server = require('mongodb').Server,
        ReplSetServers = require('mongodb').ReplSetServers,
        ObjectID = require('mongodb').ObjectID,
        Binary = require('mongodb').Binary,
        GridStore = require('mongodb').GridStore,
        Grid = require('mongodb').Grid,
        Code = require('mongodb').Code,
        BSON = require('mongodb').pure().BSON,
        assert = require('assert');

var db = new Db('test', new Server("127.0.0.1", 27017), { w:0, native_parser : false });


exports.expense_list = function(req,res){
db.open(function(err,db){
                db.collection('expenses',function(err, collection){
                        collection.find().toArray(function(err, data){
                                db.close();
                                res.render('expenses',{data : data, title : 'Expenses'});
                                });
                        });
                });
}

exports.update = function(req,res){
	res.render('expense_entry');
}

exports.insert_expense = function(req,res){
	db.open(function(err,db){
	if(!err){
	  db.collection('expenses',function(err, collection){
	  if(!err){
	    //var date = req.body.date.split('/');
	    collection.insert({date : toDate(req.body.date),
			       name : req.body.name,
			       forWhat : req.body.forWhat,
			       howMuch : req.body.howMuch },function(err){
					db.close();
					if(!err){
						exports.expense_list(req,res);
					}
				});
	  }//end of collection if
	  });
	}//end of open if
	else{
		console.log("Error: "+err)
	}
	});	
}

exports.stats = function(req, res) {
db.open(function(err,db){
                db.collection('expenses',function(err, collection){
			var search_query = {};
			if(req.query.full != 'yes'){
			var y = req.query.y ? req.query.y : new Date().getFullYear();
			var m = req.query.m ? req.query.m : (new Date().getMonth() + 1);
			req.query.y = y;
			req.query.m = m;
			var start = toDate('01'+'/'+m+'/'+y);
			var end = toDate('01'+'/'+(Number(m)+1)+'/'+y);
			search_query.date = {$gte: start, $lt: end};
			}
                        collection.find(search_query).toArray(function(err, data){
                                db.close();
				var user_vise = {};
				var item_vise = {};
				for(var i=0;i<data.length;i++){
				    var name = data[i].name;
				    var inr = Number(data[i].howMuch) + 0;
				    var item = data[i].forWhat;
				    var items_inr = inr;
				    if(user_vise[name] != undefined)
					inr = inr + Number(user_vise[name]); 
				    if(item_vise[item] != undefined)
					items_inr = items_inr + Number(item_vise[item]);
				    user_vise[name] = inr;
				    item_vise[item] = items_inr;
				}
                                res.render('status',{user_vise : user_vise, item_vise : item_vise, title : 'Status', params : req.query});
                                });
                        });
                });
}

var toDate = function(date_str){ 
	var date = date_str.split('/');
	return new Date(""+date[2] +'-'+ date[1] +'-'+ date[0]);
}
