#! /usr/bin

mongodump -d test -c expenses db/test;
git add db/test/*;
git commit -m "db update";
git push origin master;
