var Db = require('mongodb').Db;
//        MongoClient = require('mongodb').MongoClient,
var Server = require('mongodb').Server;
//        ReplSetServers = require('mongodb').ReplSetServers,
var ObjectID = require('mongodb').ObjectID;
//        Binary = require('mongodb').Binary,
//        GridStore = require('mongodb').GridStore,
//        Grid = require('mongodb').Grid,
//        Code = require('mongodb').Code,
//var BSON = require('mongodb').BSONPure;
var assert = require('assert');

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
	res.render('expense_entry',{data :  {name : '', forWhat : '', howMuch : '' }});
}

// under progress
exports.edit = function(req,res){
	var data = find_rec(req.body._id);
	res.render('expense_entry',{ 'data' : data });
	console.log(data);
}

exports.delete_rec = function(req, res){
	db.open(function(err,db){
        if(!err){
                db.collection('expenses',function(err, col){
                if(!err){
                        col.remove({ "_id" : new ObjectID(req.body._id) },function(err){
                        db.close();
                        if(!err){
                                console.log("Deleted record "+ req.body._id + " Successfuly");
                                exports.expense_list(req,res);
                        }
                        });
                }
                });
        }
        });
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
			var d = req.query.d ? req.query.d : '01';
			req.query.y = y;
			req.query.m = m;
			var start = toDate(d+'/'+m+'/'+y);
			if(m == 12 ){
				y = parseInt(y) + 1;
				m = 0;
			}
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

var insert_rec = function(req){
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
                                                return true;
                                        }
                                });
          }//end of collection if
          });
        }//end of open if
        else{
                console.log("Error: "+err)
        }
        });
	return false;
}

// under progress - not working
var find_rec = function(id){
	db.open(function(err,db){
	if(!err){
		db.collection('expenses', function(err,col){
		if(!err){
			col.find({ _id : id },function(rec){
			db.close();
			console.log(rec);
			//if(!err){
				return rec;
			//}
			});
		}
		});
	}
	});
	return false;
}
