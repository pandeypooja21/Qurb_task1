@echo off
echo Pushing changes to GitHub...
git add .
git commit -m "Fix cart functionality, offer logic, and API integration"
git push origin master
echo Done!
pause
