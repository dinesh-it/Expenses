mongodump -d test -c expenses -o db;
echo "Backed up data..";
git add db/*;
git commit -m "db update";
echo "Pushing to git repo..";
git push origin master;
echo "Pushed.$?";
