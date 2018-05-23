@echo off
java -jar closure-compiler-v20180506.jar --js_output_file=dist/min.js dist/main.js 
del main.js
ren min.js main.js 
xcopy "dist" ".\new"  /E /F /C /Q /Y
