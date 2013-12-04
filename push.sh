mongodump -d test -c expenses db;
echo "Backed up data..";
git add *;
git commit -m "db update";
echo "Pushing to git repo..";
git push origin master;
echo "Pushed.$?";
