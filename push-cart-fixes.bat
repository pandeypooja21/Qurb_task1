@echo off
echo Pushing cart button fixes to GitHub...
git add .
git commit -m "Fix cart increment/decrement buttons"
git push origin master
echo Done!
pause
