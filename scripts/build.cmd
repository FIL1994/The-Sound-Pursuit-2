@echo off
del dist\main.js
ren dist\min.js main.js
del dist\min.js
echo d | xcopy "assets" ".\dist\assets"  /E /F /C /Q /Y
