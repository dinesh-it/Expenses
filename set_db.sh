#! /usr/bin 
git pull origin master;
mongorestore -d test -c expenses db/test;
