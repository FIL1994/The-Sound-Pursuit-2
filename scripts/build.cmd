@echo off
java -jar closure-compiler-v20180506.jar --js_output_file="dist/min.js" "dist/main.js" 
del dist\main.js
ren dist\min.js main.js
del dist\min.js
echo d | xcopy "assets" ".\dist\assets"  /E /F /C /Q /Y
