./backup_db.sh;
git add db/*;
git commit -m "db update";
echo "Pushing to git repo..";
git push origin master;
echo "Pushed.$?";
