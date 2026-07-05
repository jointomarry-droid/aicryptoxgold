@echo off
cd /d "%~dp0"
set NODE_ENV=production
node -e "require('./start-server.cjs')"
